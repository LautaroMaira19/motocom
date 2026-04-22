const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

function getResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  if (/^(hola|hi|hey|buenos|buenas)/.test(message)) {
    return '¡Hola! 👋 Bienvenido a Motocom. Soy Moti. ¿Cómo puedo ayudarte hoy?';
  }

  if (/cámara|camara|frigorifico|refrigeracion/.test(message)) {
    return 'En Motocom diseñamos, construimos e instalamos cámaras frigoríficas de alta eficiencia. Contamos con 50+ años de experiencia. ❄️';
  }

  if (/instalacion|instalar|montaje/.test(message)) {
    return 'Realizamos instalaciones profesionales con equipo técnico certificado. ¿Es para una cámara nueva? 🔧';
  }

  if (/mantenimiento|reparacion|emergencia/.test(message)) {
    return 'Ofrecemos servicio técnico 24/7. Respondemos en menos de 2 horas. WhatsApp: +54 223 438-2695 📱';
  }

  if (/garantia|garantía/.test(message)) {
    return 'Ofrecemos garantía integral de 12 meses (piezas + mano de obra). Extensión hasta 36 meses disponible. ✅';
  }

  if (/horario|atienden|abierto/.test(message)) {
    return 'Horario: Lunes-Viernes 08:00-16:00 hs, Sábados 08:00-12:00 hs. Emergencias 24/7: +54 223 438-2695';
  }

  if (/contacto|whatsapp|email|instagram/.test(message)) {
    return 'WhatsApp: +54 223 438-2695\nEmail: motocom.mdp@gmail.com\nInstagram: @motocom.ar';
  }

  if (/equipo|equipamiento|sierra|picadora/.test(message)) {
    return 'Vendemos equipamiento comercial: sierras, picadoras, embutidoras, heladeras y más. 🛠️';
  }

  if (/precio|costo|presupuesto/.test(message)) {
    return 'Los precios varían según el proyecto. Contáctanos para presupuesto personalizado: +54 223 438-2695 💰';
  }

  if (/gracias|thanks/.test(message)) {
    return '¡De nada! Si necesitas algo más, estoy aquí. 😊';
  }

  if (/adiós|adios|bye/.test(message)) {
    return '¡Hasta luego! Que tengas un excelente día! 👋';
  }

  return 'Puedo ayudarte con: refrigeración, instalaciones, mantenimiento, equipamiento comercial, horarios y contacto. ¿Qué necesitas? 🤔';
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const message = data.message || '';

        if (!message.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reply: 'Por favor escribe una pregunta.' }));
          return;
        }

        const reply = getResponse(message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: 'Error procesando tu mensaje.' }));
      }
    });
    return;
  }

  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, filePath);

  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };
  const contentType = mimeTypes[extname] || 'text/plain';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor en puerto ${PORT}`);
  console.log(`🤖 Moti listo`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close(() => process.exit(0));
});
