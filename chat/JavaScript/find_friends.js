document.addEventListener('DOMContentLoaded', function() {
    fetch('find_friends.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const usersList = document.getElementById('usersList');
            data.users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.username;
                const button = document.createElement('button');
                button.textContent = 'Send Friend Request';
                button.addEventListener('click', function() {
                    sendFriendRequest(user.id);
                });
                li.appendChild(button);
                usersList.appendChild(li);
            });
        } else {
            window.location.href = 'login.html';
        }
    });
});

function sendFriendRequest(friendId) {
    const formData = new FormData();
    formData.append('friend_id', friendId);
    fetch('find_friends.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
        } else {
            alert('Failed to send friend request');
        }
    });
}