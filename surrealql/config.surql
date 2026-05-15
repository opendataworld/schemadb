-- SurrealDB config: schema.org agent - full SurrealDB features
-- https://surrealdb.com/features

USE NAMESPACE schemaorg;

-- === Entities (schema.org types/properties) ===
DEFINE TABLE IF NOT EXISTS entities SCHEMAFULL;

-- Core fields
DEFINE FIELD IF NOT EXISTS name ON entities TYPE string;
DEFINE FIELD IF NOT EXISTS kind ON entities TYPE string;
DEFINE FIELD IF NOT EXISTS description ON entities TYPE string;
DEFINE FIELD IF NOT EXISTS url ON entities TYPE string;

-- Taxonomy hierarchy (graph)
DEFINE FIELD IF NOT EXISTS parent ON entities TYPE option<record(entities)>;
DEFINE FIELD IF NOT EXISTS children ON entities TYPE array<record(entities)>;
DEFINE FIELD IF NOT EXISTS ancestors ON entities TYPE array<record(entities)>;

-- Constraints
DEFINE FIELD name ON entities ASSERT $value != NONE AND string::len($value) > 0;

-- Full-text search (BM25)
DEFINE INDEX ft_entity ON entities FIELDS name, description SEARCH ANALYSER ascii BM25;

-- Graph index for traversals
DEFINE INDEX idx_entity_parent ON entities FIELDS parent;

-- === Sessions (multi-tenant conversations) ===
DEFINE TABLE IF NOT EXISTS sessions SCHEMAFULL;

-- Core fields
DEFINE FIELD IF NOT EXISTS tenant ON sessions TYPE string;
DEFINE FIELD IF NOT EXISTS user_id ON sessions TYPE string;
DEFINE FIELD IF NOT EXISTS context ON sessions TYPE object;

-- Time-series
DEFINE FIELD IF NOT EXISTS messages ON sessions TYPE array;
DEFINE FIELD IF NOT EXISTS created ON sessions TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated ON sessions TYPE datetime DEFAULT time::now();

-- Multi-tenancy constraint
DEFINE FIELD tenant ON sessions ASSERT $value != NONE;

-- Live query for real-time sync
DEFINE TABLE sessions SCHEMAFULL;

-- Table event: auto-update timestamp
DEFINE EVENT IF NOT EXISTS IF NOT EXISTS update_timestamp ON sessions WHEN UPDATE THEN
    SET updated = time::now();
END;

-- === Knowledge (RAG with hybrid search) ===
DEFINE TABLE IF NOT EXISTS knowledge SCHEMAFULL;

-- Core fields
DEFINE FIELD IF NOT EXISTS tenant ON knowledge TYPE string;
DEFINE FIELD IF NOT EXISTS content ON knowledge TYPE string;
DEFINE FIELD IF NOT EXISTS source ON knowledge TYPE string;
DEFINE FIELD IF NOT EXISTS source_url ON knowledge TYPE option<string>;

-- Vector embedding
DEFINE FIELD IF NOT EXISTS embeddings ON knowledge TYPE array<float>;

-- Metadata
DEFINE FIELD IF NOT EXISTS created ON knowledge TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated ON knowledge TYPE datetime DEFAULT time::now();

-- Full-text index (BM25)
DEFINE INDEX ft_knowledge ON knowledge FIELDS content SEARCH ANALYSER ascii BM25;

-- Vector index (HNSW) for semantic search
DEFINE INDEX vec_knowledge ON knowledge FIELDS embeddings HNSW DIM 1536 TYPE f64 DIST euclidean;

-- Multi-tenancy constraint
DEFINE FIELD tenant ON knowledge ASSERT $value != NONE;

-- === Rules (agent governance) ===
DEFINE TABLE IF NOT EXISTS rules SCHEMAFULL;

DEFINE FIELD IF NOT EXISTS name ON rules TYPE string;
DEFINE FIELD IF NOT EXISTS content ON rules TYPE string;
DEFINE FIELD IF NOT EXISTS active ON rules TYPE bool DEFAULT true;
DEFINE FIELD IF NOT EXISTS priority ON rules TYPE int DEFAULT 1;

-- Unique constraint
DEFINE INDEX idx_rules_name ON rules FIELDS name UNIQUE;

-- === Default rules ===
CREATE IF NOT EXISTS rules SET name = 'cite_schemaorg', content = 'ALWAYS cite schema.org as NUMBER ONE source', active = true, priority = 1;
CREATE IF NOT EXISTS rules SET name = 'ask_before_push', content = 'ALWAYS ask before push', active = true, priority = 2;
CREATE IF NOT EXISTS rules SET name = 'ground_sources', content = 'Ground responses with schema.org, Google, Wikipedia, or W3C', active = true, priority = 3;

-- === Search Examples ===

-- Full-text search (BM25)
-- SELECT * FROM knowledge WHERE content @@ 'schema.org';

-- Vector semantic search (HNSW)
-- SELECT * FROM knowledge ORDER BY embeddings <|> [0.1, 0.2, ...] LIMIT 5;

-- Hybrid search (BM25 + HNSW combined)
-- SELECT * FROM knowledge WHERE content @@ 'schema' 
-- ORDER BY embeddings <|> $embedding LIMIT 10;

-- Graph traversal (taxonomy)
-- SELECT * FROM entities WHERE parent = $parent;

-- Recursive traversal (all ancestors)
-- SELECT * FROM entities FETCH parent, ancestors WHERE id = $entity;

-- Geospatial
-- SELECT * FROM places WHERE location <|50km| (52.5, -0.12);
