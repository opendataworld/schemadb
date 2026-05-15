// Lightweight SurrealDB HTTP server
import http from 'http';
import { Surreal } from 'surrealdb';

const PORT = process.env.PORT || 3000;
const db = new Surreal();

// Connect to SurrealDB (expects server running)
async function setup() {
  try {
    await db.connect('ws://localhost:8000');
    await db.use({ namespace: 'schemaorg', database: 'agent' });
    console.log('Connected to SurrealDB');
  } catch (e) {
    console.log('SurrealDB not running. Start: surreal start --auth --user root --pass root');
  }
}

// HTTP request handler
async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'GET' && req.url === '/health') {
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  
  if (req.method === 'GET' && req.url === '/api/entities') {
    try {
      const entities = await db.query('SELECT * FROM entities');
      res.end(JSON.stringify(entities));
    } catch (e) {
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }
  
  res.end(JSON.stringify({ message: 'Schema.org Agent API' }));
}

const server = http.createServer(handler);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  setup();
});
