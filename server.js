const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function getResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // Saludos
  if (/^(hola|hi|hey|buenos|buenas|qué tal|q tal)/.test(message)) {
    return '¡Hola! 👋 Bienvenido a Motocom. Soy Moti, tu asistente de refrigeración. ¿Cómo puedo ayudarte hoy? Podemos hablar sobre cámaras frigoríficas, instalaciones, mantenimiento o equipamiento comercial.';
  }

  // Preguntas sobre cámaras frigoríficas
  if (/cámara|camara|frigorifico|frigorífico|refrigeracion|refrigeración|congelador|almacenamiento/.test(message)) {
    if (/diseño|diseñar|proyecto|personalizado/.test(message)) {
      return 'Excelente pregunta. Realizamos diseños personalizados de cámaras frigoríficas según tus necesidades específicas. Nuestro equipo técnico evalúa tu espacio y genera una propuesta detallada. ¿Cuál es tu negocio? (carnicería, restaurante, comercio, industria)';
    }
    return 'En Motocom diseñamos, construimos e instalamos cámaras frigoríficas de alta eficiencia. Contamos con 50+ años de experiencia en refrigeración industrial y comercial. Trabajamos con carnicerías, restaurantes, comercios, frigoríficos y más. ❄️';
  }

  // Preguntas sobre instalación
  if (/instalacion|instalar|montaje|montar|colocacion|colocar/.test(message)) {
    if (/cuanto tiempo|cuanto demora|tiempo|duración/.test(message)) {
      return 'El tiempo de instalación varía según la complejidad del proyecto. Proyectos simples toman 2-5 días, instalaciones complejas pueden tomar 1-3 semanas. Te podemos dar un cronograma exacto tras evaluar tu caso específico. 🔧';
    }
    return 'Realizamos instalaciones profesionales con equipo técnico certificado e internacionalmente capacitado. Cumplimos con todas las normativas de seguridad y regulaciones ambientales. ¿Es para una cámara nueva o ampliación? 🔧';
  }

  // Preguntas sobre mantenimiento y emergencias
  if (/mantenimiento|servicio|reparacion|falla|problema|emergencia|urgente|24\/7/.test(message)) {
    if (/24|emergencia|urgente|rapido|rapida/.test(message)) {
      return 'Contamos con servicio técnico de emergencia 24/7. Nuestro equipo responde en menos de 2 horas en el área de Mar del Plata. Para emergencias: 📱 WhatsApp: +54 223 438-2695';
    }
    return 'Ofrecemos programas de mantenimiento preventivo personalizado. Realizamos revisiones periódicas, limpiezas, ajustes de presión y cambios de refrigerante. También atendemos reparaciones urgentes y mantenimiento correctivo. 🔧';
  }

  // Preguntas sobre garantía
  if (/garantia|garantía|cobertura|asegurado|asegurada|protegido/.test(message)) {
    return 'Ofrecemos garantía integral de 12 meses en todas nuestras instalaciones (piezas + mano de obra). Disponemos extensión de cobertura hasta 36 meses según el proyecto. ¿Quieres saber más sobre algún servicio específico? ✅';
  }

  // Preguntas sobre horarios
  if (/horario|atienden|abierto|abierta|cerrado|cierra|abre/.test(message)) {
    return '📅 **Horario de Atención:**\n• Lunes a Viernes: 08:00 - 16:00 hs\n• Sábados: 08:00 - 12:00 hs\n\n🚨 Emergencias 24/7 por WhatsApp: +54 223 438-2695';
  }

  // Preguntas sobre contacto
  if (/contacto|contactar|llamar|llamada|numero|teléfono|telefono|whatsapp|email|instagram|ubicación|ubicacion/.test(message)) {
    return '📱 **Contacta con nosotros:**\n📱 WhatsApp: +54 223 438-2695\n📧 Email: motocom.mdp@gmail.com\n📍 Ubicación: Mar del Plata, Argentina\n📱 Instagram: @motocom.ar\n\nEstamos aquí para ayudarte 24/7 😊';
  }

  // Preguntas sobre equipamiento comercial
  if (/equipo|equipamiento|sierra|picadora|embutidora|heladera|herramientas|carniceria|carnicería|restaurante/.test(message)) {
    if (/comprar|precio|costo|venta/.test(message)) {
      return 'Vendemos equipamiento comercial de primera calidad: sierras, picadoras, embutidoras, heladeras, mostradores frigoríficos y más. Para ver nuestro catálogo y precios, contáctanos por WhatsApp: +54 223 438-2695 o visita nuestra sección de productos. 🛠️';
    }
    return 'Contamos con equipamiento profesional para carnicerías, restaurantes y comercios. Ofrecemos venta, instalación y servicio técnico. ¿Qué tipo de negocio tienes? 🛠️';
  }

  // Preguntas sobre experiencia
  if (/experiencia|años|tiempo|desde|fundada|historia/.test(message)) {
    return 'Motocom fue fundada en 1973 y cuenta con más de 50 años de experiencia en refrigeración y equipamiento comercial. Hemos servido a más de 500 clientes satisfechos en la región. ¡Somos tu socio de confianza! 🏆';
  }

  // Preguntas sobre precios
  if (/precio|costo|cuanto cuesta|cuanto sale|presupuesto|valor|tarifa/.test(message)) {
    return 'Los precios varían según el alcance, complejidad y especificaciones técnicas del proyecto. Para un presupuesto personalizado y sin compromiso, contáctanos:\n📱 WhatsApp: +54 223 438-2695\n📧 Email: motocom.mdp@gmail.com 💰';
  }

  // Agradecimientos
  if (/gracias|thanks|muchas gracias|graciass|thx/.test(message)) {
    return '¡De nada! Es un placer ayudarte. Si tienes más preguntas o necesitas algo más, no dudes en escribir. 😊';
  }

  // Despedidas
  if (/adiós|adios|bye|chao|hasta|nos vemos|cya/.test(message)) {
    return '¡Hasta luego! Si necesitas más ayuda, estaré aquí. ¡Que tengas un excelente día! 👋';
  }

  // Respuesta por defecto mejorada
  return 'Entiendo tu pregunta. Para brindarte la mejor respuesta, puedo ayudarte con:\n\n• Cámaras frigoríficas y refrigeración\n• Instalaciones y montajes\n• Mantenimiento y emergencias técnicas\n• Equipamiento comercial\n• Horarios y contacto\n\nO puedes contactarnos directamente:\n📱 WhatsApp: +54 223 438-2695\n📧 motocom.mdp@gmail.com 🤔';
}

// API endpoint para chat
app.post('/api/chat', (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ reply: 'Por favor, escribe una pregunta.' });
    }

    const reply = getResponse(message);
    return res.json({ reply });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      reply: 'Disculpa, tuve un problema. Intenta nuevamente o contáctanos por WhatsApp al +54 223 438-2695'
    });
  }
});

// Servir index.html para rutas no encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor ejecutándose en puerto ${PORT} (env.PORT=${process.env.PORT})`);
  console.log(`🤖 Moti está listo`);
});
