const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

function getResponse(userMessage) {
  const message = userMessage.toLowerCase();

  if (message.includes('hola') || message.includes('hi') || message.includes('hey')) {
    return '¡Hola! Bienvenido a Motocom. 😊 Soy Moti, tu asistente. ¿Qué servicio te interesa? Tenemos refrigeración, instalaciones y equipamiento comercial.';
  }

  if (message.includes('precio') || message.includes('costo') || message.includes('cuanto cuesta')) {
    return 'Los precios varían según el proyecto. Te recomiendo que contactes con nuestro equipo de ventas para un presupuesto personalizado. Puedes escribirle por WhatsApp al +54 223 438-2695 o enviar un email a motocom.mdp@gmail.com 💰';
  }

  if (message.includes('frigorifico') || message.includes('refrigeracion') || message.includes('cámara') || message.includes('camara')) {
    return 'En Motocom somos expertos en diseño, instalación y mantenimiento de cámaras frigoríficas para industrias, carnicerías, restaurantes y negocios en general. Contamos con más de 50 años de experiencia. ❄️';
  }

  if (message.includes('instalacion') || message.includes('instalar')) {
    return 'Sí, realizamos instalaciones profesionales con equipo técnico certificado. Nos aseguramos de cumplir con todas las normativas internacionales. ¿Necesitas más información? 🔧';
  }

  if (message.includes('mantenimiento') || message.includes('reparacion') || message.includes('falla') || message.includes('emergencia')) {
    return 'Ofrecemos servicio técnico 24/7 para emergencias. Respondemos en menos de 2 horas. Disponemos de programas de mantenimiento preventivo personalizados. ¿Necesitas ayuda urgente? 📞';
  }

  if (message.includes('garantia') || message.includes('garantía')) {
    return 'Ofrecemos garantía integral de 12 meses en todas nuestras instalaciones, con opción de extensión hasta 36 meses. Incluye cobertura de piezas y mano de obra. ✅';
  }

  if (message.includes('horario') || message.includes('atienden') || message.includes('cuando') || message.includes('abierto')) {
    return 'Nuestro horario de atención es:\n\n📅 Lunes a Viernes: 08:00 - 16:00 hs\n📅 Sábados: 08:00 - 12:00 hs\n\nPara emergencias fuera de horario, contáctanos por WhatsApp al +54 223 438-2695 y nuestro equipo técnico responderá lo antes posible.';
  }

  if (message.includes('contacto') || message.includes('contactar') || message.includes('llamar') || message.includes('whatsapp')) {
    return 'Claro, puedes contactarnos de varias formas:\n📱 WhatsApp: +54 223 438-2695\n📧 Email: motocom.mdp@gmail.com\n📍 Ubicación: Mar del Plata, Argentina\n📱 Instagram: @motocom.ar';
  }

  if (message.includes('equipo') || message.includes('equipamiento') || message.includes('herramienta') || message.includes('sierra') || message.includes('picadora')) {
    return 'Vendemos equipamiento comercial profesional como sierras, picadoras, embutidoras, heladeras y más para carnicerías, restaurantes y negocios. Consulta nuestro catálogo. 🛠️';
  }

  if (message.includes('gracias') || message.includes('thanks')) {
    return '¡De nada! Si necesitas algo más, estoy aquí para ayudarte. 😊';
  }

  if (message.includes('adiós') || message.includes('bye') || message.includes('hasta') || message.includes('adios')) {
    return '¡Hasta luego! Si necesitas más ayuda, no dudes en escribir. ¡Que tengas un excelente día! 👋';
  }

  return 'Entiendo tu pregunta. Para brindarte una respuesta más precisa, te recomiendo contactar directamente con nuestro equipo:\n📱 WhatsApp: +54 223 438-2695\n📧 Email: motocom.mdp@gmail.com\n\n¿Hay algo más en lo que pueda ayudarte? 🤔';
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

  // API endpoint para chat
  if (pathname === '/api/chat' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        console.log('Body recibido:', body);
        const data = JSON.parse(body);
        const message = data.message;

        if (!message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reply: 'Mensaje vacío' }));
          return;
        }

        const reply = getResponse(message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch (error) {
        console.error('Error parsing:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          reply: 'Error al procesar tu mensaje'
        }));
      }
    });
    return;
  }

  // Servir archivos estáticos
  let filePath = '.' + pathname;
  if (filePath === '.' || filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🤖 Moti está listo`);
});
