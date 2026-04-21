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

    // Agregar mensaje del usuario
    addMessage(message, 'user');
    motiInput.value = '';

    // Mostrar indicador de escritura
    showTyping();

    try {
        // Enviar al backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        removeTyping();

        if (data && data.reply) {
            addMessage(data.reply, 'bot');
        } else {
            addMessage('No entendí tu pregunta. ¿Puedes intentar de otra forma?', 'bot');
        }
    } catch (error) {
        console.error('Error completo:', error);
        removeTyping();
        addMessage('Disculpa, tuve un problema. Intenta nuevamente o contáctanos por WhatsApp al +54 223 438-2695', 'bot');
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
