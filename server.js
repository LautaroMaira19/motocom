const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Chat API
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body);
        const reply = message.toLowerCase().includes('hola')
          ? '¡Hola! Soy Moti de Motocom. ¿Cómo puedo ayudarte?'
          : 'Contáctanos por WhatsApp: +54 223 438-2695';

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: 'Error' }));
      }
    });
    return;
  }

  // Servir archivos estáticos
  let filePath = req.url === '/' ? 'index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404');
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Servidor puerto ${PORT}`);
});
