const http = require('http');
const fs = require('fs');
const path = require('path');
const base = 'C:/Users/86183/.codex/visualizations/2026/08/09/019fe74c-8d25-7ac0-b9e6-c026e900ed1c';
const srv = http.createServer((req, res) => {
  let url = req.url === '/' ? 'index.html' : req.url;
  const ext = path.extname(url);
  const ct = {'.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript'}[ext] || 'text/plain';
  const d = fs.readFileSync(path.join(base, url));
  res.writeHead(200, {Content-Type: ct});
  res.end(d);
});
srv.listen(8080, () => console.log('http://localhost:8080'));
