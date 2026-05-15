-- Load schema.org JSON-LD into SurrealDB

-- This function loads and parses the schema.org JSON-LD
-- and creates entities + relations from it

-- Create entity from JSON-LD node
DEFINE FUNCTION fn::load_entity($node)
BEGIN
  LET id = $node["@id"];
  LET type = $node["@type"];
  LET comment = $node["rdfs:comment"];
  LET label = $node["rdfs:label"];
  LET subClassOf = $node["rdfs:subClassOf"];
  LET domain = $node["schema:domainIncludes"];
  LET range = $node["schema:rangeIncludes"];
  
  -- Extract type name (e.g., "schema:Thing" -> "Thing")
  LET name = string::replace(id, "schema:", "");
  
  -- Create entity
  LET entity = CREATE entities SET 
    name = name,
    type = type,
    description = comment,
    url = "https://schema.org/" + name;
  
  -- Add subclass relation
  IF (subClassOf != none) THEN
    LET parent = string::replace(subClassOf["@id"], "schema:", "");
    CREATE relations SET 
      from = entity.id,
      to = (SELECT id FROM entities WHERE name = parent LIMIT 1)[0].id,
      type = "subclass_of";
  END
  
  -- Add domain includes (property -> class)
  IF (domain != none) THEN
    FOR target IN domain DO
      LET target_name = string::replace(target["@id"], "schema:", "");
      CREATE relations SET
        from = entity.id,
        to = (SELECT id FROM entities WHERE name = target_name LIMIT 1)[0].id,
        type = "domain_includes";
    END
  END
  
  -- Add range includes (property -> expected type)
  IF (range != none) THEN
    FOR target IN range DO
      LET target_name = string::replace(target["@id"], "schema:", "");
      CREATE relations SET
        from = entity.id,
        to = (SELECT id FROM entities WHERE name = target_name LIMIT 1)[0].id,
        type = "range_includes";
    END
  END
  
  RETURN entity;
END;

-- Batch load function
DEFINE FUNCTION fn::load_schemaorg($jsonld)
BEGIN
  LET graph = $jsonld["@graph"];
  LET count = 0;
  
  FOR node IN graph DO
    IF (node["@type"] == "rdfs:Class" OR node["@type"] == "rdf:Property") THEN
      fn::load_entity(node);
      count += 1;
    END
  END
  
  RETURN { loaded: count };
END;

-- Import from URL
DEFINE FUNCTION fn::import_schemaorg()
BEGIN
  LET jsonld = http::get("https://schema.org/version/latest/schemaorg-current-https.jsonld");
  RETURN fn::load_schemaorg(jsonld);
END;
