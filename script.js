document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            fetch('send_message.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `message=${encodeURIComponent(message)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    messageInput.value = '';
                    fetchMessages();
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    function fetchMessages() {
        fetch('get_messages.php')
            .then(response => response.json())
            .then(data => {
                chatMessages.innerHTML = '';
                data.forEach(msg => {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message';
                    messageElement.innerHTML = `${msg.message} <span class="timestamp">${msg.timestamp}</span>`;
                    chatMessages.appendChild(messageElement);
                });
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            .catch(error => console.error('Error:', error));
    }

    sendButton.addEventListener('click', sendMessage);
    
    setInterval(fetchMessages, 3000);
});