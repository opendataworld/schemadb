import Surreal from 'surrealdb';

const db = new Surreal();
await db.connect('mem://');
await db.use({ namespace: 'schemaorg', database: 'agent' });

// Create schema
await db.query(`
DEFINE TABLE entities SCHEMAFULL;
DEFINE FIELD name ON entities TYPE string;
DEFINE FIELD type ON entities TYPE string;
DEFINE FIELD description ON entities TYPE string;
DEFINE FIELD url ON entities TYPE string;
DEFINE FIELD embedding ON entities TYPE array<float>;
`);

await db.query(`
DEFINE TABLE relations SCHEMAFULL;
DEFINE FIELD from ON relations TYPE record(entities);
DEFINE FIELD to ON relations TYPE record(entities);
DEFINE FIELD type ON relations TYPE string;
`);

// Create sample entities
await db.query(`
CREATE entities SET name = 'Thing', type = 'rdfs:Class', description = 'The most generic type of item', url = 'https://schema.org/Thing';
CREATE entities SET name = 'CreativeWork', type = 'rdfs:Class', description = 'A work of creative authorship', url = 'https://schema.org/CreativeWork';
CREATE entities SET name = 'Person', type = 'rdfs:Class', description = 'A person', url = 'https://schema.org/Person';
CREATE entities SET name = 'name', type = 'rdf:Property', description = 'The name of the item', url = 'https://schema.org/name';
`);

// Query
const result = await db.query('SELECT * FROM entities');
console.log('Entities created:');
for (const e of result) {
  console.log(`- ${e.name} (${e.type}): ${e.description}`);
}

console.log('\\nSchema loaded successfully!');
process.exit(0);
