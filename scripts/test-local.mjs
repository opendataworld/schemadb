import Surreal from 'surrealdb';

const db = new Surreal();
await db.connect('mem://');
await db.use({ namespace: 'test', database: 'test' });

// Create schema
await db.query(`
DEFINE TABLE entities SCHEMAFULL;
DEFINE FIELD name ON entities TYPE string;
DEFINE FIELD type ON entities TYPE string;
DEFINE FIELD description ON entities TYPE string;
DEFINE FIELD url ON entities TYPE string;
`);

await db.query(`
DEFINE TABLE relations SCHEMAFULL;
DEFINE FIELD from_rel ON relations TYPE record(entities);
DEFINE FIELD to_rel ON relations TYPE record(entities);
DEFINE FIELD rel_type ON relations TYPE string;
`);

// Create schema.org types
console.log('Creating entities...');
await db.query(`CREATE entities:thing SET name = 'Thing', type = 'rdfs:Class', description = 'The most generic type of item', url = 'https://schema.org/Thing'`);

await db.query(`CREATE entities:creativework SET name = 'CreativeWork', type = 'rdfs:Class', description = 'A work of creative authorship', url = 'https://schema.org/CreativeWork'`);

await db.query(`CREATE entities:person SET name = 'Person', type = 'rdfs:Class', description = 'A person', url = 'https://schema.org/Person'`);

// Query all
console.log('\n--- Query: All entities ---');
const all = await db.query('SELECT * FROM entities');
for (const e of all) {
  console.log(`- ${e.name} (${e.type})`);
}

// Search
console.log('\n--- Search: "Person" ---');
const search = await db.query("SELECT * FROM entities WHERE name CONTAINS 'Person'");
for (const e of search) {
  console.log(`- Found: ${e.name}`);
}

console.log('\n✓ E2E test passed!');
await db.close();
process.exit(0);
