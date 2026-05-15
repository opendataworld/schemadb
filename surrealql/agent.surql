-- Schema.org Agent - SurrealDB with Multi-tenancy

-- Use namespace per tenant: DEFINE NAMESPACE $tenant
-- Or use tenant_id field for shared DB

-- Tenants table (super Admin only)
DEFINE TABLE tenants SCHEMAFULL;
DEFINE FIELD name ON tenants TYPE string;
DEFINE FIELD api_key ON tenants TYPE string;
DEFINE FIELD plan ON tenants TYPE string DEFAULT 'free';
DEFINE FIELD created ON tenants TYPE datetime;
DEFINE FIELD active ON tenants TYPE bool DEFAULT true;

-- Sessions table (per tenant)
DEFINE TABLE sessions SCHEMAFULL;
DEFINE FIELD tenant ON sessions TYPE record(tenants);
DEFINE FIELD user_id ON sessions TYPE string;
DEFINE FIELD messages ON sessions TYPE array;
DEFINE FIELD created ON sessions TYPE datetime;

-- Knowledge table (per tenant)
DEFINE TABLE knowledge SCHEMAFULL;
DEFINE FIELD tenant ON knowledge TYPE record(tenants);
DEFINE FIELD content ON knowledge TYPE string;
DEFINE FIELD embedding ON knowledge TYPE array<float>;
DEFINE FIELD source ON knowledge TYPE string;
DEFINE FIELD url ON knowledge TYPE string;
DEFINE FIELD created ON knowledge TYPE datetime;

-- Rules table
DEFINE TABLE rules SCHEMAFULL;
DEFINE FIELD name ON rules TYPE string;
DEFINE FIELD content ON rules TYPE string;
DEFINE FIELD active ON rules TYPE bool DEFAULT true;

-- Entities table (shared or per tenant)
DEFINE TABLE entities SCHEMAFULL;
DEFINE FIELD name ON entities TYPE string;
DEFINE FIELD type ON entities TYPE string;
DEFINE FIELD description ON entities TYPE string;
DEFINE FIELD url ON entities TYPE string;
DEFINE FIELD embedding ON entities TYPE array<float>;

-- Relations table
DEFINE TABLE relations SCHEMAFULL;
DEFINE FIELD from_rel ON relations TYPE record(entities);
DEFINE FIELD to_rel ON relations TYPE record(entities);
DEFINE FIELD rel_type ON relations TYPE string;
DEFINE FIELD weight ON relations TYPE float DEFAULT 1.0;

-- Indexes
DEFINE INDEX knowledge_vec ON knowledge FIELDS embedding MTREE;
DEFINE INDEX entities_name ON entities FIELDS name SEARCH ANALYZER ascii BM25;

-- Agent rules (default)
CREATE rules SET name = 'ask_before_push', content = 'ALWAYS ask before push', active = true;
CREATE rules SET name = 'no_db_without_approval', content = 'Never push DB updates without explicit user approval', active = true;
CREATE rules SET name = 'cite_schemaorg', content = 'ALWAYS cite schema.org as NUMBER ONE source', active = true;

-- Multi-tenant functions

-- Get tenant from API key
DEFINE FUNCTION fn::get_tenant($api_key)
BEGIN
  LET tenant = SELECT * FROM tenants WHERE api_key = $api_key AND active = true LIMIT 1;
  IF (tenant.len() = 0) THEN
    RETURN none;
  END
  RETURN tenant[0];
END;

-- Create session for tenant
DEFINE FUNCTION fn::create_session($tenant_id, $user_id)
BEGIN
  LET session_id = string::uuid();
  CREATE sessions SET tenant = $tenant_id, user_id = $user_id, messages = [], created = time::now();
  RETURN session_id;
END;

-- Add message to tenant session
DEFINE FUNCTION fn::add_message($tenant_id, $session_id, $role, $content)
BEGIN
  LET msg = { role: $role, content: $content, created: time::now() };
  UPDATE sessions SET messages += msg WHERE id = $session_id AND tenant = $tenant_id;
  RETURN msg;
END;

-- Query knowledge for tenant
DEFINE FUNCTION fn::query_knowledge($tenant_id, $query)
BEGIN
  RETURN SELECT * FROM knowledge WHERE tenant = $tenant_id AND content CONTAINS $query;
END;
