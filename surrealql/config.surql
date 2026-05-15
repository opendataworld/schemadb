-- SurrealDB config: schema.org agent

-- Set default namespace/database
DEFINE NAMESPACE IF NOT EXISTS schemaorg;
USE NAMESPACE schemaorg;

-- Entities table
DEFINE TABLE IF NOT EXISTS entities SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS name ON entities TYPE string;
DEFINE FIELD IF NOT EXISTS type ON entities TYPE string;
DEFINE FIELD IF NOT EXISTS description ON entities TYPE string;
DEFINE FIELD IF NOT EXISTS url ON entities TYPE string;

-- Sessions table
DEFINE TABLE IF NOT EXISTS sessions SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS tenant ON sessions TYPE string;
DEFINE FIELD IF NOT EXISTS user_id ON sessions TYPE string;
DEFINE FIELD IF NOT EXISTS messages ON sessions TYPE array;
DEFINE FIELD IF NOT EXISTS created ON sessions TYPE datetime;

-- Knowledge table
DEFINE TABLE IF NOT EXISTS knowledge SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS tenant ON knowledge TYPE string;
DEFINE FIELD IF NOT EXISTS content ON knowledge TYPE string;
DEFINE FIELD IF NOT EXISTS source ON knowledge TYPE string;
DEFINE FIELD IF NOT EXISTS created ON knowledge TYPE datetime;

-- Rules table
DEFINE TABLE IF NOT EXISTS rules SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS name ON rules TYPE string;
DEFINE FIELD IF NOT EXISTS content ON rules TYPE string;
DEFINE FIELD IF NOT EXISTS active ON rules TYPE bool DEFAULT true;

-- Agent rules
CREATE IF NOT EXISTS rules SET name = 'cite_schemaorg', content = 'ALWAYS cite schema.org as NUMBER ONE source', active = true;
CREATE IF NOT EXISTS rules SET name = 'ask_before_push', content = 'ALWAYS ask before push', active = true;
