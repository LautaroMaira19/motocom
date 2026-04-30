const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

function getResponse(msg) {
  const m = msg.toLowerCase();

  if (m.includes('hola') || m.includes('hi') || m.includes('hey') || m.includes('buenos')) {
    const saludos = [
      '¡Hola! Bienvenido a Motocom. 🧊 Soy Moti, tu asistente. ¿En qué puedo ayudarte?',
      '¡Ey! Soy Moti, aquí en Motocom nos gusta mantener las cosas BIEN frías. 🥶 ¿Qué necesitas?',
      '¡Hola amigo! ¿En qué puedo ayudarte hoy? 😎❄️'
    ];
    return saludos[Math.floor(Math.random() * saludos.length)];
  }
  if (m.includes('servicio') || m.includes('ofrecen') || m.includes('venden'))
    return '¡Déjame presentarte mis servicios! 🧊✨\n\n❄️ Cámaras frigoríficas\n🔧 Equipos frigoríficos\n🛠️ Instalación y montaje\n📋 Mantenimiento técnico 24/7\n💡 Asesoramiento especializado\n🏪 Equipamiento comercial\n\n¿Cuál te interesa?';
  if (m.includes('precio') || m.includes('costo') || m.includes('cuánto') || m.includes('presupuesto'))
    return '💰 Los precios son personalizados según cada proyecto.\n\nContactá a nuestro equipo:\n📱 WhatsApp: +542234382695\n📧 Email: info@motocom.com.ar';
  if (m.includes('frigorifico') || m.includes('refrigeracion') || m.includes('cámara') || m.includes('camara') || m.includes('frío') || m.includes('frio'))
    return '¡Ahora sí estamos hablando de lo MÍO! 🧊❄️\n\n✅ Cámaras frigoríficas\n✅ Sistemas de refrigeración\n✅ Mantenimiento preventivo\n✅ Refrigerantes ecológicos\n\n¿Necesitas más información?';
  if (m.includes('instalacion') || m.includes('instalar') || m.includes('montaje'))
    return 'Instalaciones profesionales:\n\n🔨 Equipo técnico certificado\n📋 Cumplimiento de normativas\n✅ Supervisión permanente\n📍 Mar del Plata\n\n¿Tenés un proyecto?';
  if (m.includes('mantenimiento') || m.includes('reparacion') || m.includes('falla') || m.includes('emergencia') || m.includes('urgente'))
    return '¡Tenemos servicio técnico 24/7! 🚨\n\n🚨 Respuesta rápida\n📞 Disponible 365 días/año\n🔧 Equipo especializado\n\n¡EMERGENCIA! +542234382695 (WhatsApp)';
  if (m.includes('garantia') || m.includes('garantía'))
    return '✅ Garantía integral:\n\n📅 12 meses (estándar)\n📅 Extensible hasta 36 meses\n🔧 Incluye piezas y mano de obra';
  if (m.includes('horario') || m.includes('atienden') || m.includes('cuándo') || m.includes('cuando') || m.includes('abierto'))
    return 'Nuestro horario:\n\n📅 Lunes a Viernes: 08:00 - 16:00 hs\n📅 Sábados: 08:00 - 12:00 hs\n📅 Domingos: Cerrado\n\n🚨 Emergencias 24/7: +542234382695';
  if (m.includes('contacto') || m.includes('whatsapp') || m.includes('email') || m.includes('teléfono') || m.includes('telefono'))
    return 'Contactanos:\n\n📱 WhatsApp: +542234382695\n📧 Email: info@motocom.com.ar\n📍 Mar del Plata, Argentina\n📱 Instagram: @motocom.ar';
  if (m.includes('equipo') || m.includes('sierra') || m.includes('picadora') || m.includes('embutidora') || m.includes('heladera'))
    return 'Equipamiento comercial:\n\n🔪 Sierras automáticas y manuales\n🥩 Picadoras y embutidoras\n❄️ Heladeras y vitrinas\n🏪 Mobiliario comercial';
  if (m.includes('experiencia') || m.includes('años') || m.includes('trayectoria'))
    return '⭐ Fundada en 1973\n⭐ Más de 50 años de experiencia\n⭐ 500+ clientes satisfechos\n⭐ Líder en refrigeración en Mar del Plata';
  if (m.includes('necesito ayuda') || m.includes('ayuda') || m.includes('ayudar') || m.includes('qué hacen') || m.includes('que hacen'))
    return '¡Estoy acá para ayudarte! 🧊 Contame qué está pasando.\n\nPuedo orientarte sobre:\n\n🔧 Problemas con tu equipo de refrigeración\n📋 Servicios e instalaciones\n💰 Presupuestos\n🕐 Horarios de atención\n📞 Datos de contacto\n\n¿Por dónde empezamos?';
  if (m.includes('gracias'))
    return '¡De nada! 🧊 ¿Hay algo más en lo que pueda ayudarte?';
  if (m.includes('adiós') || m.includes('adios') || m.includes('bye') || m.includes('hasta'))
    return '¡Hasta luego! 👋 Que tengas un día bien COOL. 🧊';

  return 'Para más información contactá a nuestro equipo:\n📱 WhatsApp: +542234382695\n📧 Email: info@motocom.com.ar\n\n¿Hay algo más en lo que pueda ayudarte?';
}


const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body);
        const reply = getResponse(message || '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: 'Error. Contactanos: +542234382695' }));
      }
    });
    return;
  }

  // Servir archivos estáticos
  const urlPath = req.url.split('?')[0];
  let filePath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
  filePath = path.join(__dirname, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
