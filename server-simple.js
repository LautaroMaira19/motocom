const http = require('http');
const fs = require('fs');
const path = require('path');

function getResponse(msg) {
  const m = msg.toLowerCase();

  if (m.includes('hola') || m.includes('hi') || m.includes('hey') || m.includes('buenos')) {
    const saludos = [
      '¡Hola! Bienvenido a Motocom. 🧊 Soy Moti, tu asistente (bastante frío 😎). ¿En qué puedo ayudarte?',
      '¡Ey! Soy Moti, aquí en Motocom nos gusta mantener las cosas BIEN frías. 🥶 ¿Qué necesitas?',
      '¡Hola amigo! Prepárate para un servicio con temperatura de MIEDO. 😱❄️ ¿Qué te trae por aquí?'
    ];
    return saludos[Math.floor(Math.random() * saludos.length)];
  }

  if (m.includes('servicio') || m.includes('ofrecen') || m.includes('venden')) {
    return '¡Déjame presentarte mi cartera de SOLUCIONES CONGELANTES! 🧊✨\n\n❄️ Cámaras frigoríficas (que congelan miedos)\n🔧 Equipos frigoríficos (hermanos mayores del hielo)\n🛠️ Instalación y montaje (con mano de expertos, no de Olaf)\n📋 Mantenimiento técnico 24/7 (para que el frío nunca se vaya)\n💡 Asesoramiento especializado (somos muy frescos en esto 😎)\n🏪 Equipamiento comercial (sierras, picadoras, embutidoras - TODO para tu negocio)\n\n¿Cuál de estos servicios te CONGELA de interés?';
  }

  if (m.includes('precio') || m.includes('costo') || m.includes('cuánto') || m.includes('presupuesto')) {
    return '💰 ¡Ah, la pregunta más fría del siglo!\n\nComo dice el refrán: "El frío está para echarse un cable" 😎❄️\n\nLos precios son más frescos cuando son personalizados. Cada negocio tiene sus necesidades frigoríficas únicas. Contacta con nuestro equipo y te haremos un presupuesto tan COOL que no te lo creerás:\n\n📱 WhatsApp: +54 223 438-2695\n📧 Email: motocom.mdp@gmail.com\n\n(Prometo que el presupuesto no congelará tu billetera 😄)';
  }

  if (m.includes('frigorifico') || m.includes('refrigeracion') || m.includes('cámara') || m.includes('camara') || m.includes('frío') || m.includes('frio')) {
    return '¡Ahora sí estamos hablando de lo MÍO! 🧊❄️\n\nEn Motocom somos EXPERTOS en mantener el frío:\n✅ Cámaras frigoríficas que congelan envidias\n✅ Sistemas tan fríos que te ponen los pelos de punta\n✅ Mantenimiento preventivo (para que no se le queme el frío)\n✅ Refrigerantes ecológicos (frío responsable 🌍)\n\nLlevamos más de 50 años... ¡casi el mismo tiempo que el hielo antártico! ¿Necesitas que congelemos algo?';
  }

  if (m.includes('instalacion') || m.includes('instalar') || m.includes('montaje')) {
    return 'Realizamos instalaciones profesionales:\n\n🔨 Equipo técnico certificado\n📋 Cumplimiento de normativas\n✅ Supervisión permanente\n📍 Cobertura en Mar del Plata\n\n¿Tienes un proyecto?';
  }

  if (m.includes('mantenimiento') || m.includes('reparacion') || m.includes('falla') || m.includes('emergencia') || m.includes('urgente')) {
    return '¡NOOOO! ¿Se fue el frío? 😱 ¡PÁNICO! 🧊❌\n\nTranquilo, tenemos servicio técnico 24/7:\n🚨 Llegamos en menos de 2 horas (tipo Elsa de Frozen pero más rápido)\n📞 Disponible 365 días/año (ni Navidad escapa del frío)\n🔧 Equipo especializado en "revivir el hielo"\n📋 Mantenimiento preventivo (porque el frío se merece cuidados)\n\n¡EMERGENCIA FRÍA! +54 223 438-2695 (WhatsApp de emergencia)';
  }

  if (m.includes('garantia') || m.includes('garantía') || m.includes('cobertura')) {
    return '✅ Garantía integral:\n\n📅 12 meses completos (estándar)\n📅 Extensible hasta 36 meses\n🔧 Incluye piezas y mano de obra\n💪 Respaldo técnico permanente\n\nTu tranquilidad es nuestra prioridad.';
  }

  if (m.includes('horario') || m.includes('atienden') || m.includes('cuándo') || m.includes('cuando') || m.includes('abierto')) {
    return 'Nuestro horario:\n\n📅 Lunes a Viernes: 08:00 - 16:00 hs\n📅 Sábados: 08:00 - 12:00 hs\n📅 Domingos: Cerrado\n\n🚨 Emergencias 24/7: +54 223 438-2695 (WhatsApp)';
  }

  if (m.includes('contacto') || m.includes('contactar') || m.includes('whatsapp') || m.includes('email') || m.includes('teléfono') || m.includes('telefono')) {
    return 'Contactanos:\n\n📱 WhatsApp: +54 223 438-2695\n📧 Email: motocom.mdp@gmail.com\n📍 Mar del Plata, Argentina\n📱 Instagram: @motocom.ar';
  }

  if (m.includes('equipo') || m.includes('equipamiento') || m.includes('sierra') || m.includes('picadora') || m.includes('embutidora') || m.includes('heladera')) {
    return 'Equipamiento comercial:\n\n🔪 Sierras automáticas y manuales\n🥩 Picadoras y embutidoras\n❄️ Heladeras y vitrinas\n🏪 Mobiliario comercial\n\nPerfecto para negocios gastronómicos. ¿Qué necesitas?';
  }

  if (m.includes('experiencia') || m.includes('años') || m.includes('trayectoria')) {
    return 'Nuestra trayectoria:\n\n⭐ Fundada en 1973\n⭐ Más de 50 años\n⭐ 500+ clientes satisfechos\n⭐ Líder en refrigeración\n⭐ Equipo certificado internacionalmente\n\nTu confianza es nuestra fortaleza. 💪';
  }

  if (m.includes('gracias') || m.includes('thanks')) {
    return '¡De NADA! 🧊 (así como el frío, ¡sin costo extra!) 😄 ¿Hay algo más en lo que pueda enfriarte la vida... digo, ayudarte?';
  }

  if (m.includes('adiós') || m.includes('adios') || m.includes('bye') || m.includes('hasta')) {
    return '¡Hasta luego! 👋 Recuerda: mantente FRESCO. 😎❄️ ¡Que tengas un día bien COOL! 🧊';
  }

  return 'Entiendo tu pregunta. 🤔 Mira, soy un chatbot tan frío que a veces no lo capto todo 😅\n\nContacta directamente con nuestro equipo de EXPERTOS EN FRÍO:\n📱 WhatsApp: +54 223 438-2695\n📧 Email: motocom.mdp@gmail.com\n\n¿Hay algo más que necesites congelar... digo, resolver? 😄';
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body);
        const reply = getResponse(message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: 'Error' }));
      }
    });
    return;
  }

  let file = '.' + req.url;
  if (file === './') file = './index.html';
  
  const ext = path.extname(file);
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpg', '.gif': 'image/gif', '.svg': 'image/svg+xml' };
  const type = types[ext] || 'text/plain';

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404');
    } else {
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    }
  });
});

server.listen(3000, () => console.log('✅ Servidor en http://localhost:3000'));
