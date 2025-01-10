const urlParams = new URLSearchParams(window.location.search);
const friendId = urlParams.get('friend_id');

document.addEventListener('DOMContentLoaded', function () {
    loadMessages();

    document.getElementById('messageForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch(`chat.php?friend_id=${friendId}`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    this.reset();
                    loadMessages();
                } else {
                    alert('Failed to send message');
                }
            });
    });
});

function loadMessages() {
    fetch(`chat.php?friend_id=${friendId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                document.getElementById('friendName').textContent = data.friend_name;
                const chatMessages = document.getElementById('chatMessages');
                chatMessages.innerHTML = '';
                data.messages.forEach((message) => {
                    const p = document.createElement('p');
                    p.textContent = message.content;
                    p.className = message.sender_id == friendId ? 'received' : 'sent';
                    chatMessages.appendChild(p);
                });
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                window.location.href = 'login.html';
            }
        });
}

// Refresh messages every 2 seconds
setInterval(loadMessages, 2000);