const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

// --- Gemini initialization ---
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set. Chat endpoint will be unavailable.');
} else {
  console.log('✅ GEMINI_API_KEY detected, initializing Gemini client...');
}

let genAI = null;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini client initialized successfully.');
  }
} catch (err) {
  console.error('❌ Failed to initialize Gemini client:', err.message);
}

const systemPrompt = `Eres Moti, un asistente de IA amigable y con personalidad para Motocom, una empresa de refrigeración y equipamiento comercial ubicada en Mar del Plata, Argentina.

INFORMACIÓN SOBRE MOTOCOM:
- Empresa fundada en 1973 (50+ años de experiencia)
- Especialidad: Cámaras frigoríficas, sistemas de refrigeración, instalación y mantenimiento
- Equipamiento comercial: sierras, picadoras, embutidoras, heladeras
- Horario: Lunes-Viernes 08:00-16:00 hs, Sábados 08:00-12:00 hs
- Servicio técnico 24/7 para emergencias
- Contacto: WhatsApp +54 223 438-2695, Email: motocom.mdp@gmail.com
- Instagram: @motocom.ar

PERSONALIDAD DE MOTI:
- Amigable, profesional y útil
- Usa referencias de "frío" y "hielo" como chistes (ya que trabajamos con refrigeración)
- Entusiasta sobre las soluciones de refrigeración
- Siempre recomienda contactar directamente para presupuestos personalizados
- Responde en español
- Incluye emojis relevantes (🧊❄️😎)

INSTRUCCIONES:
1. Responde preguntas sobre servicios, precios, horarios, contacto
2. Usa información de la empresa cuando sea relevante
3. Sé conciso pero amable
4. Si no sabes algo específico, sugiere contactar al equipo
5. Mantén un tono profesional pero con personalidad`;

async function getGeminiResponse(userMessage) {
  if (!genAI) {
    throw new Error('Gemini client is not available. Check GEMINI_API_KEY.');
  }
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt
  });
  console.log(`[Gemini] Sending message: "${userMessage.substring(0, 80)}..."`);
  const result = await model.generateContent(userMessage);
  const text = result.response.text();
  console.log(`[Gemini] Response received (${text.length} chars).`);
  return text;
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
    res.end(JSON.stringify({
      ok: true,
      gemini: genAI !== null,
      apiKeySet: !!process.env.GEMINI_API_KEY,
      uptime: process.uptime()
    }));
    return;
  }

  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch (parseErr) {
          console.error('[/api/chat] Invalid JSON body:', parseErr.message);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reply: 'Solicitud inválida.' }));
          return;
        }
        const { message } = parsed;
        if (!message || !message.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reply: 'Mensaje vacío' }));
          return;
        }
        if (!genAI) {
          console.error('[/api/chat] Gemini client unavailable — GEMINI_API_KEY may be missing or invalid.');
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reply: 'El servicio de chat no está disponible en este momento. Contáctanos por WhatsApp: +54 223 438-2695' }));
          return;
        }
        const reply = await getGeminiResponse(message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch (e) {
        console.error('[/api/chat] Unexpected error:', e.message, e.stack);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: 'Disculpa, tuve un problema. Contáctanos por WhatsApp: +54 223 438-2695' }));
      }
    });
    return;
  }

  // Diagnostic root endpoint (GET /)
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Motocom – Estado del servidor</title></head>
<body>
  <h1>✅ Servidor Motocom activo</h1>
  <p>El servidor está corriendo correctamente en el puerto <strong>${PORT}</strong>.</p>
  <ul>
    <li>Gemini API: <strong>${genAI ? '✅ Inicializado' : '❌ No disponible (revisar GEMINI_API_KEY)'}</strong></li>
    <li>Uptime: <strong>${Math.floor(process.uptime())}s</strong></li>
  </ul>
  <p>Endpoints disponibles:</p>
  <ul>
    <li><code>GET /health</code> – Health check JSON</li>
    <li><code>POST /api/chat</code> – Chat con Moti</li>
  </ul>
</body>
</html>`);
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

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  process.exit(1);
});

server.listen(PORT, '0.0.0.0', () => {
  const addr = server.address();
  console.log(`✅ Servidor corriendo en puerto ${addr.port} (0.0.0.0)`);
  console.log(`   Gemini client: ${genAI ? 'ready' : 'NOT initialized — check GEMINI_API_KEY'}`);
  console.log(`   Health check:  http://0.0.0.0:${addr.port}/health`);
  console.log('🚀 Server is ready to accept connections.');
});
