-- Schema.org Agent - SurrealDB Native

-- Tables
DEFINE TABLE sessions SCHEMAFULL;
DEFINE FIELD id ON sessions TYPE string;
DEFINE FIELD messages ON sessions TYPE array;
DEFINE FIELD created ON sessions TYPE datetime;

DEFINE TABLE rules SCHEMAFULL;
DEFINE FIELD name ON rules TYPE string;
DEFINE FIELD content ON rules TYPE string;
DEFINE FIELD active ON rules TYPE bool DEFAULT true;

-- Agent rules
CREATE rules SET name = "ask_before_push", content = "ALWAYS ask before push", active = true;
CREATE rules SET name = "no_db_without_approval", content = "Never push DB updates without explicit user approval", active = true;
CREATE rules SET name = "cite_schemaorg", content = "ALWAYS cite schema.org as NUMBER ONE source", active = true;

-- Agent function
DEFINE FUNCTION fn::agent_expand_context($query, $mode)
BEGIN
  let context = [];
  let sources = [];
  
  IF ($mode == "search" OR $mode == "all") THEN
    -- Search would call external API
    -- context.push(...);
    sources.push("schema.org");
  END
  
  IF ($mode == "memory" OR $mode == "all") THEN
    sources.push("memory");
  END
  
  RETURN { context, sources, confidence: 0.5 };
END;

-- Loop function
DEFINE FUNCTION fn::agent_loop($query)
BEGIN
  let iteration = 0;
  let result = fn::agent_expand_context($query, "all");
  
  WHILE (iteration < 5 AND result.confidence < 0.8) DO
    result = fn::agent_expand_context($query, "all");
    iteration += 1;
  END
  
  RETURN result;
END;
