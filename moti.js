// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
}

// Chatbot Moti - Powered by Gemini
const motiButton = document.getElementById('motiButton');
const motiClose = document.getElementById('motiClose');
const motiChat = document.getElementById('motiChat');
const motiInput = document.getElementById('motiInput');
const motiSend = document.getElementById('motiSend');
const motiMessages = document.getElementById('motiMessages');

// Abrir/Cerrar chat
motiButton.addEventListener('click', () => {
    motiChat.classList.add('active');
    motiInput.focus();
});

motiClose.addEventListener('click', () => {
    motiChat.classList.remove('active');
});

// Estado del diagnóstico
let diagnostico = null;

// Flujos de diagnóstico
const flujos = {
    no_enfria: {
        pregunta: '🔍 Vamos a diagnosticar el problema. ¿El evaporador (la parte de atrás adentro de la cámara) tiene mucho hielo acumulado?',
        respuestas: {
            si: '🧊 Posiblemente el evaporador está bloqueado por hielo, lo que impide la circulación de aire frío.\n\n✅ Sugerencia:\n1. Desconectá el equipo y dejá que ese hielo se descongele completamente\n2. Una vez descongelado, probá hacer andar solo los ventiladores para verificar que el aire circule bien\n3. Si el problema persiste luego de descongelar, puede haber una falla en el sistema de desescarche\n\n📞 ¿Querés que un técnico lo revise? Llamanos al +54 223 438-2695',
            no: '🤔 Entendido. El problema puede ser otro.\n\n¿Notás alguno de estos síntomas?\n- El compresor no arranca (silencio total)\n- El compresor arranca pero no enfría\n- Hay ruidos extraños\n\nContanos más para ayudarte mejor, o llamanos directo al +54 223 438-2695 🔧'
        }
    }
};

function detectarProblema(msg) {
    const m = msg.toLowerCase();
    if (m.includes('no enfr') || m.includes('no esta enfriando') || m.includes('no está enfriando') ||
        m.includes('perdio el frio') || m.includes('perdió el frío') || m.includes('no tiene frio') ||
        m.includes('no tiene frío') || m.includes('caliente') || m.includes('no funciona') ||
        m.includes('falla') || m.includes('problema') || m.includes('roto') || m.includes('rota')) {
        return 'no_enfria';
    }
    return null;
}

function esRespuestaAfirmativa(msg) {
    const m = msg.toLowerCase().trim();
    return m === 'si' || m === 'sí' || m === 'yes' || m === 's' ||
           m.startsWith('si,') || m.startsWith('sí,') || m.includes('tiene hielo') ||
           m.includes('hay hielo') || m.includes('mucho hielo') || m.includes('si tiene');
}

function esRespuestaNegativa(msg) {
    const m = msg.toLowerCase().trim();
    return m === 'no' || m === 'nope' || m === 'n' ||
           m.startsWith('no,') || m.includes('no tiene') || m.includes('no hay');
}

// Enviar mensaje
motiSend.addEventListener('click', sendMessage);
motiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const message = motiInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    motiInput.value = '';
    showTyping();

    // Si hay un diagnóstico activo, procesar la respuesta localmente
    if (diagnostico) {
        const flujo = flujos[diagnostico];
        let reply;

        if (esRespuestaAfirmativa(message)) {
            reply = flujo.respuestas.si;
            diagnostico = null;
        } else if (esRespuestaNegativa(message)) {
            reply = flujo.respuestas.no;
            diagnostico = null;
        } else {
            reply = '¿Podés responder con **sí** o **no**? ' + flujo.pregunta;
        }

        setTimeout(() => {
            removeTyping();
            addMessage(reply, 'bot');
        }, 600);
        return;
    }

    // Detectar si el usuario describe un problema antes de ir al backend
    const problema = detectarProblema(message);
    if (problema) {
        diagnostico = problema;
        setTimeout(() => {
            removeTyping();
            addMessage(flujos[problema].pregunta, 'bot');
        }, 600);
        return;
    }

    // Consulta normal al backend
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        removeTyping();
        addMessage(data.reply || 'No entendí tu pregunta. ¿Podés intentar de otra forma?', 'bot');
    } catch (error) {
        removeTyping();
        addMessage('Disculpa, tuve un problema. Contactanos por WhatsApp: +54 223 438-2695', 'bot');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `moti-message ${sender}`;

    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="moti-avatar">M</div>
            <div class="moti-message-bubble">${escapeHtml(text)}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="moti-message-bubble">${escapeHtml(text)}</div>
        `;
    }

    motiMessages.appendChild(messageDiv);
    motiMessages.scrollTop = motiMessages.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'moti-message bot';
    typingDiv.id = 'motiTyping';
    typingDiv.innerHTML = `
        <div class="moti-avatar">M</div>
        <div class="moti-message-bubble">
            <div class="moti-typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    motiMessages.appendChild(typingDiv);
    motiMessages.scrollTop = motiMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById('motiTyping');
    if (typing) typing.remove();
}

// Escapar HTML para evitar XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
