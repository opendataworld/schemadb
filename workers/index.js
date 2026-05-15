// Cloudflare Worker - schema.org Agent
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/" || path === "") {
      return new Response(HTML_HOME, { headers: { "Content-Type": "text/html" } });
    }
    if (path === "/search" || path === "/search/") {
      return new Response(HTML_SEARCH, { headers: { "Content-Type": "text/html" } });
    }
    if (path === "/chat" || path === "/chat/") {
      return new Response(HTML_CHAT, { headers: { "Content-Type": "text/html" } });
    }
    return new Response("Not Found", { status: 404 });
  },
};

const HTML_HOME = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>schema.org Agent</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui; background: #0d1117; color: #e6edf3; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { text-align: center; padding: 2rem; }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .subtitle { color: #8b949e; font-size: 1.25rem; margin-bottom: 2rem; }
    .nav { display: flex; gap: 1rem; justify-content: center; }
    .nav a { padding: 1rem 2rem; background: #161b22; border: 1px solid #30363d; border-radius: 8px; color: #e6edf3; text-decoration: none; }
    .nav a:hover { border-color: #58a6ff; background: #58a6ff; color: #0d1117; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📚 schema.org Agent</h1>
    <p class="subtitle">AI agent to help understand schema.org taxonomy & vocabulary</p>
    <nav>
      <a href="/search">🔍 Search</a>
      <a href="/chat">💬 Chat</a>
    </nav>
  </div>
</body>
</html>`;

const HTML_SEARCH = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Search - schema.org Agent</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui; background: #0d1117; color: #e6edf3; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
    nav { display: flex; gap: 1rem; margin-bottom: 2rem; }
    nav a { color: #8b949e; text-decoration: none; }
    nav a:hover { color: #e6edf3; }
    .search-box { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 1.5rem; }
    .search-form { display: flex; gap: 0.75rem; }
    input { flex: 1; padding: 0.875rem 1.25rem; font-size: 1.125rem; background: #0d1117; border: 1px solid #30363d; border-radius: 8px; color: #e6edf3; }
    button { padding: 0.875rem 2rem; font-weight: 600; background: #58a6ff; color: #0d1117; border: none; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="container">
    <nav>
      <a href="/">Home</a>
      <a href="/search">Search</a>
      <a href="/chat">Chat</a>
    </nav>
    <div class="search-box">
      <form class="search-form">
        <input type="text" placeholder="Search schema.org..." required>
        <button>Search</button>
      </form>
    </div>
  </div>
</body>
</html>`;

const HTML_CHAT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat - schema.org Agent</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui; background: #0d1117; color: #e6edf3; height: 100vh; }
    #app { display: flex; height: 100vh; }
    #sidebar { width: 280px; background: #161b22; border-right: 1px solid #30363d; padding: 1rem; }
    #main { flex: 1; display: flex; flex-direction: column; }
    #messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .message { max-width: 80%; padding: 0.875rem 1rem; border-radius: 12px; }
    .message-user { align-self: flex-end; background: #58a6ff; color: #0d1117; }
    .message-agent { align-self: flex-start; background: #161b22; border: 1px solid #30363d; }
    #input-bar { padding: 1rem; background: #161b22; border-top: 1px solid #30363d; display: flex; gap: 0.75rem; }
    input { flex: 1; padding: 0.875rem 1rem; background: #0d1117; border: 1px solid #30363d; border-radius: 8px; color: #e6edf3; }
    button { padding: 0.875rem 1.5rem; font-weight: 600; background: #58a6ff; color: #0d1117; border: none; border-radius: 8px; cursor: pointer; }
    nav a { color: #8b949e; text-decoration: none; margin-bottom: 1rem; display: block; }
  </style>
</head>
<body>
  <div id="app">
    <div id="sidebar">
      <nav>
        <a href="/">Home</a>
        <a href="/search">Search</a>
        <a href="/chat">Chat</a>
      </nav>
      <h3>📚 Types</h3>
      <div>Thing</div>
      <div>Person</div>
      <div>Organization</div>
      <div>Product</div>
    </div>
    <div id="main">
      <div id="messages">
        <div class="message message-agent">Hi! I'm the schema.org Q&A Agent. Ask me about schema.org!</div>
      </div>
      <div id="input-bar">
        <input type="text" placeholder="Ask about schema.org...">
        <button>Send</button>
      </div>
    </div>
  </div>
</body>
</html>`;
