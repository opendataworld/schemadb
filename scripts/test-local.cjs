const { Surreal } = require('surrealdb');

async function test() {
  const db = new Surreal();
  // Connect to local server (websocket)
  await db.connect('ws://localhost:8000');
  await db.use({ namespace: 'test', database: 'test' });

  // Create schema
  await db.query(`
    DEFINE TABLE entities SCHEMAFULL;
    DEFINE FIELD name ON entities TYPE string;
    DEFINE FIELD type ON entities TYPE string;
    DEFINE FIELD description ON entities TYPE string;
    DEFINE FIELD url ON entities TYPE string;
  `);

  console.log('Creating schema.org types...');
  await db.query(`CREATE entities:thing SET name = 'Thing', type = 'rdfs:Class', description = 'The most generic type of item', url = 'https://schema.org/Thing'`);

  await db.query(`CREATE entities:person SET name = 'Person', type = 'rdfs:Class', description = 'A person', url = 'https://schema.org/Person'`);

  // Query all
  console.log('\n--- All entities ---');
  const all = await db.query('SELECT name, type FROM entities');
  for (const e of all) {
    console.log(`- ${e.name} (${e.type})`);
  }

  console.log('\n✓ E2E test passed!');
  await db.close();
}

test().catch(e => {
  console.error('Error:', e.message);
  console.log('\nNeed SurrealDB server running: surreal start --auth --user root --pass root');
});
