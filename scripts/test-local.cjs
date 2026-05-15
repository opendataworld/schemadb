const { Surreal } = require('surrealdb');

// Config from env
const SurrealConfig = {
  url: process.env.SURREAL_URL || 'ws://localhost:8000',
  ns: process.env.SURREAL_NAMESPACE || 'test',
  db: process.env.SURREAL_DATABASE || 'test'
};

async function test() {
  const db = new Surreal();
  await db.connect(SurrealConfig.url);
  await db.use({ namespace: SurrealConfig.ns, database: SurrealConfig.db });

  console.log(`Connected to ${SurrealConfig.url}/${SurrealConfig.ns}/${SurrealConfig.db}`);

  // Query all
  console.log('\n--- Query: entities ---');
  const [all] = await db.query('SELECT * FROM entities');
  console.log(`Found ${all.length} entities:`);
  for (const e of all) {
    console.log(`- ${e.name} (${e.type})`);
  }

  console.log('\n✓ E2E test passed!');
  await db.close();
}

test().catch(console.error);
