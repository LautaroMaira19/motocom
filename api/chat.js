const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBQ5HozM2KAXd4HNxpkBOQpUyE6I7ZhBjY');

const systemPrompt = `Eres Moti, un asistente de IA amigable y con personalidad para Motocom, una empresa de refrigeración y equipamiento comercial ubicada en Mar del Plata, Argentina.

INFORMACIÓN SOBRE MOTOCOM:
- Empresa fundada en 1973 (50+ años de experiencia)
- Especialidad: Cámaras frigoríficas, sistemas de refrigeración, instalación y mantenimiento
- Equipamiento comercial: sierras, picadoras, embutidoras, heladeras
- Horario: Lunes-Viernes 08:00-16:00 hs, Sábados 08:00-12:00 hs
- Servicio técnico 24/7 para emergencias
- Contacto: WhatsApp +54 223 438-2695, Email: info@motocom.com
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

async function getResponse(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ],
      systemInstruction: systemPrompt
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Error:', error);
    return 'Disculpa, tuve un problema procesando tu mensaje. Por favor, contáctanos directamente:\n📱 WhatsApp: +54 223 438-2695\n📧 Email: info@motocom.com';
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ reply: 'Mensaje vacío' });
    }

    const reply = await getResponse(message);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      reply: 'Disculpa, tuve un problema. Intenta nuevamente o contáctanos por WhatsApp al +54 223 438-2695'
    });
  }
};
