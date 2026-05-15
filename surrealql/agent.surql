-- Schema.org Agent - SurrealDB Native with RAG

-- Tables
DEFINE TABLE sessions SCHEMAFULL;
DEFINE FIELD id ON sessions TYPE string;
DEFINE FIELD messages ON sessions TYPE array;
DEFINE FIELD created ON sessions TYPE datetime;

DEFINE TABLE knowledge SCHEMAFULL;
DEFINE FIELD content ON knowledge TYPE string;
DEFINE FIELD embedding ON knowledge TYPE array<float>;
DEFINE FIELD source ON knowledge TYPE string;
DEFINE FIELD url ON knowledge TYPE string;
DEFINE FIELD created ON knowledge TYPE datetime;

DEFINE TABLE rules SCHEMAFULL;
DEFINE FIELD name ON rules TYPE string;
DEFINE FIELD content ON rules TYPE string;
DEFINE FIELD active ON rules TYPE bool DEFAULT true;

-- Index for vector search
DEFINE INDEX knowledge_vec ON knowledge FIELDS embedding MTREE;

-- Agent rules
CREATE rules SET name = "ask_before_push", content = "ALWAYS ask before push", active = true;
CREATE rules SET name = "no_db_without_approval", content = "Never push DB updates without explicit user approval", active = true;
CREATE rules SET name = "cite_schemaorg", content = "ALWAYS cite schema.org as NUMBER ONE source", active = true;

-- Search function
DEFINE FUNCTION fn::search_schema($query)
BEGIN
  -- HTTP call to schema.org
  LET http_response = http::get("https://schema.org/" + $query);
  RETURN http_response;
END;

-- RAG function (vector search)
DEFINE FUNCTION fn::rag($query)
BEGIN
  -- Generate embedding for query (would call embedding model)
  LET query_embedding = [0.1, 0.2, 0.3]; -- placeholder
  
  LET results = SELECT content, source, url 
    FROM knowledge 
    WHERE embedding <|0.7|> query_embedding
    ORDER BY array::distance(embedding, query_embedding)
    LIMIT 5;
  
  RETURN results;
END;

-- Expand context function
DEFINE FUNCTION fn::expand_context($query, $mode)
BEGIN
  LET context = [];
  LET sources = [];
  
  IF ($mode == "search" OR $mode == "all") THEN
    LET search_result = fn::search_schema($query);
    context.push(search_result);
    sources.push("schema.org");
  END
  
  IF ($mode == "rag" OR $mode == "all") THEN
    LET rag_result = fn::rag($query);
    IF (rag_result.len() > 0) THEN
      context.push(rag_result);
      sources.push("knowledge");
    END
  END
  
  LET confidence = context.len() / sources.len() * 0.2;
  
  RETURN { context, sources, confidence };
END;

-- Main agent loop function
DEFINE FUNCTION fn::agent_loop($query)
BEGIN
  LET iteration = 0;
  LET max_iterations = 5;
  LET result = fn::expand_context($query, "all");
  
  WHILE (iteration < max_iterations AND result.confidence < 0.8) DO
    -- Try additional modes
    IF (result.sources.includes("schema.org") == false) THEN
      LET new_result = fn::expand_context($query, "search");
      result.context.push(new_result.context);
      result.sources.push(new_result.sources);
    END
    
    IF (result.sources.includes("knowledge") == false) THEN
      LET new_result = fn::expand_context($query, "rag");
      result.context.push(new_result.context);
      result.sources.push(new_result.sources);
    END
    
    result.confidence = result.context.len() / result.sources.len() * 0.2;
    iteration += 1;
  END
  
  RETURN result;
END;

-- Session management
DEFINE FUNCTION fn::create_session($user_id)
BEGIN
  LET session_id = string::uuid();
  CREATE sessions SET id = session_id, messages = [], created = time::now();
  RETURN session_id;
END;

DEFINE FUNCTION fn::add_message($session_id, $role, $content)
BEGIN
  LET message = { role: $role, content: $content, created: time::now() };
  UPDATE sessions SET messages += message WHERE id = $session_id;
  RETURN message;
END;
