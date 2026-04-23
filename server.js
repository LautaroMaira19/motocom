const http = require('http');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const PORT = process.env.PORT || 8080;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt
  });
  const result = await model.generateContent(userMessage);
  return result.response.text();
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
    req.on('end', async () => {
      try {
        const { message } = JSON.parse(body);
        if (!message || !message.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reply: 'Mensaje vacío' }));
          return;
        }
        const reply = await getGeminiResponse(message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch (e) {
        console.error('Chat error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: 'Disculpa, tuve un problema. Contáctanos por WhatsApp: +54 223 438-2695' }));
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
