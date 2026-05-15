-- Entity Search using SurrealDB Knowledge Graph

-- Entities table (nodes)
DEFINE TABLE entities SCHEMAFULL;
DEFINE FIELD name ON entities TYPE string;
DEFINE FIELD type ON entities TYPE string;  -- class, property, org, person, concept
DEFINE FIELD description ON entities TYPE string;
DEFINE FIELD url ON entities TYPE string;
DEFINE FIELD embedding ON entities TYPE array<float>;
DEFINE FIELD created ON entities TYPE datetime;

-- Relationships table (edges)
DEFINE TABLE relations SCHEMAFULL;
DEFINE FIELD from ON relations TYPE record(entities);
DEFINE FIELD to ON relations TYPE record(entities);
DEFINE FIELD type ON relations TYPE string;  -- subclass_of, domain_includes, range_includes, related_to
DEFINE FIELD weight ON relations TYPE float DEFAULT 1.0;

-- Indexes
DEFINE INDEX entities_name ON entities FIELDS name SEARCH ANALYZER ascii BM25;
DEFINE INDEX entities_vec ON entities FIELDS embedding MTREE;
DEFINE INDEX entities_type ON entities FIELDS type;

-- Seed schema.org entities
CREATE entities SET 
  name = "Thing", 
  type = "class",
  description = "The most generic type of item.", 
  url = "https://schema.org/Thing";

CREATE entities SET 
  name = "CreativeWork", 
  type = "class", 
  description = "A work of creative authorship.", 
  url = "https://schema.org/CreativeWork",
  description = "A class for all creative works.";

-- Entity search function
DEFINE FUNCTION fn::entity_search($query, $type, $limit)
BEGIN
  LET results = [];
  
  -- 1. Exact match
  LET exact = SELECT * FROM entities WHERE name = $query LIMIT 1;
  IF (exact.len() > 0) THEN
    results.push(exact[0]);
  END
  
  -- 2. Full-text search
  LET text = SELECT * FROM entities 
    WHERE name CONTAINS $query
    OR description CONTAINS $query
    ORDER BY @score
    LIMIT $limit;
  
  FOR item IN text DO
    IF (results.contains(item) == false) THEN
      results.push(item);
    END
  END
  
  -- 3. Type filter
  IF ($type != null) THEN
    results = results.filter(item => item.type = $type);
  END
  
  RETURN results;
END;

-- Semantic entity search (vector)
DEFINE FUNCTION fn::entity_semantic($query, $limit)
BEGIN
  LET query_embedding = [0.1, 0.2, 0.3]; -- placeholder
  
  LET results = SELECT name, type, description, url,
    array::distance(embedding, query_embedding) AS score
  FROM entities
  WHERE embedding <|0.8|> query_embedding
  ORDER BY score
  LIMIT $limit;
  
  RETURN results;
END;

-- Graph entity search
DEFINE FUNCTION fn::entity_graph($entity, $depth)
BEGIN
  LET visited = [];
  LET queue = [{ id: $entity, depth: 0 }];
  
  WHILE (queue.len() > 0) DO
    LET current = queue.pop();
    
    IF (visited.contains(current.id)) THEN
      CONTINUE;
    END
    visited.push(current.id);
    
    -- Get outgoing
    LET outgoing = SELECT ->relations->entities AS target, type, weight
      FROM entities WHERE id = current.id;
    
    FOR rel IN outgoing DO
      IF (current.depth < $depth) THEN
        queue.push({ id: rel.target.id, depth: current.depth + 1 });
      END
    END
  END
  
  RETURN visited;
END;

-- Get entity with relations
DEFINE FUNCTION fn::entity_get($entity_name)
BEGIN
  LET entity = SELECT * FROM entities WHERE name = $entity_name LIMIT 1;
  
  IF (entity.len() = 0) THEN
    RETURN null;
  END
  
  LET e = entity[0];
  
  -- Get incoming relations
  LET incoming = SELECT <-relations.from AS from_entity, type, weight
    FROM relations WHERE to = e.id;
  
  -- Get outgoing relations  
  LET outgoing = SELECT ->relations->entities AS to_entity, type, weight
    FROM relations WHERE from = e.id;
  
  RETURN {
    entity: e,
    incoming: incoming,
    outgoing: outgoing
  };
END;

-- Schema.org autocomplete
DEFINE FUNCTION fn::entity_autocomplete($prefix, $limit)
BEGIN
  RETURN SELECT name, type, url 
    FROM entities 
    WHERE name STARTSWITH $prefix
    ORDER BY name
    LIMIT $limit;
END;
