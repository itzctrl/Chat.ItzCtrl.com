document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const notificationsPanel = document.getElementById('notificationsPanel');
    const sendFriendRequestPanel = document.getElementById('sendFriendRequestPanel');
    const chatPanel = document.getElementById('chatPanel');
    const notificationsItem = document.getElementById('notifications');
    const sendFriendRequestItem = document.getElementById('sendFriendRequest');
    const friendsList = document.getElementById('friendsListItems');
    const sendRequestButton = document.getElementById('sendRequest');
    const friendUsernameInput = document.getElementById('friendUsername');
    const notificationsList = document.getElementById('notificationsList');
    const notificationCount = document.getElementById('notificationCount');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');
    const chatFriendName = document.getElementById('chatFriendName');

    let currentChatFriendId = null;
    let lastMessageId = 0;
    let messageUpdateInterval;
    let selectedFriendId = null;

    toggleSidebar.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('sidebar-active');
    });

    notificationsItem.addEventListener('click', function() {
        showPanel(notificationsPanel);
        loadNotifications();
    });

    sendFriendRequestItem.addEventListener('click', function() {
        showPanel(sendFriendRequestPanel);
    });

   sendRequestButton.addEventListener('click', function() {
       sendFriendRequest(friendUsernameInput.value);
   });

   function showPanel(panel) {
       notificationsPanel.style.display = 'none';
       sendFriendRequestPanel.style.display = 'none';
       chatPanel.style.display = 'none';
       panel.style.display = 'block';
   }

    function loadDashboardData() {
        fetch('dashboard_data.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('username').textContent = data.username;
                    updateFriendsList(data.friends);
                    updateNotificationCount(data.notificationCount);
                    
                    // Activate sidebar on first login
                    sidebar.classList.add('active');
                    mainContent.classList.add('sidebar-active');
                } else {
                    window.location.href = 'index.html';
                }
            });
    }

   function updateFriendsList(friends) {
       friendsList.innerHTML = '';
       friends.forEach(friend => {
           const li = document.createElement('li');
           li.textContent = friend.username;
           li.dataset.friendId = friend.id;
           li.addEventListener('click', () => openChat(friend.id, friend.username));
           friendsList.appendChild(li);
       });
       
       // Add context menu event listener for right-click
       friendsList.addEventListener('contextmenu', function(e) {
           if (e.target.tagName === 'LI') {
               e.preventDefault();
               selectedFriendId = e.target.dataset.friendId;
               showContextMenu(e.pageX, e.pageY);
           }
       });
   }

   function showContextMenu(x, y) {
       const contextMenu = document.getElementById('contextMenu');
       contextMenu.style.display = 'block';
       contextMenu.style.left = `${x}px`;
       contextMenu.style.top = `${y}px`;
   }

   // Remove friend from list
   document.getElementById('removeFriend').addEventListener('click', function() {
       if (selectedFriendId) {
           fetch(`remove_friend.php`, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded',
               },
               body: `friend_id=${selectedFriendId}`
           })
           .then(response => response.json())
           .then(data => {
               alert(data.message);
               loadDashboardData();
               hideContextMenu();
           });
       }
   });

   // Hide context menu when clicking elsewhere
   window.addEventListener('click', hideContextMenu);

   function hideContextMenu() {
       const contextMenu = document.getElementById('contextMenu');
       contextMenu.style.display = 'none';
   }

   function updateNotificationCount(count) {
       notificationCount.textContent = count;
   }

   function sendFriendRequest(username) {
       fetch('send_friend_request.php', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
           },
           body: `username=${encodeURIComponent(username)}`
       })
       .then(response => response.json())
       .then(data => {
           alert(data.message);
           if (data.success) {
               friendUsernameInput.value = '';
           }
       });
   }

   function loadNotifications() {
       fetch('get_notifications.php')
           .then(response => response.json())
           .then(data => {
               notificationsList.innerHTML = '';
               data.notifications.forEach(notification => {
                   const li = document.createElement('li');
                   li.textContent = `${notification.from_username} sent you a friend request`;
                   const acceptButton = document.createElement('button');
                   acceptButton.textContent = 'Accept';
                   acceptButton.addEventListener('click', () => respondToFriendRequest(notification.id, true));
                   const declineButton = document.createElement('button');
                   declineButton.textContent = 'Decline';
                   declineButton.addEventListener('click', () => respondToFriendRequest(notification.id, false));
                   li.appendChild(acceptButton);
                   li.appendChild(declineButton);
                   notificationsList.appendChild(li);
               });
               updateNotificationCount(data.notifications.length);
           });
   }

   function respondToFriendRequest(notificationId, accept) {
       fetch('respond_friend_request.php', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
           },
           body: `notification_id=${notificationId}&accept=${accept ? 1 : 0}`
       })
       .then(response => response.json())
       .then(data => {
           alert(data.message);
           loadNotifications();
           loadDashboardData();
       });
   }

   function openChat(friendId, friendName) {
       currentChatFriendId = friendId;
       lastMessageId = 0; 
       chatFriendName.textContent = friendName;
       showPanel(chatPanel);
       chatMessages.innerHTML = ''; 
       loadChatMessages();
       startMessageUpdates();
   }

   function loadChatMessages() {
       if (!currentChatFriendId) return;

       fetch(`get_messages.php?friend_id=${currentChatFriendId}&last_id=${lastMessageId}`)
           .then((response) => response.json())
           .then((data) => {
               if (data.success) {
                   appendNewMessages(data.messages);
               } else {
                   console.error('Failed to load messages:', data.message);
               }
           });
   }

   function appendNewMessages(messages) {
       messages.forEach((message) => {
           if (message.id > lastMessageId) { 
               const p = document.createElement('p');
               p.textContent = `${message.from_username}: ${message.content}`;
               p.className = message.sender_id == currentChatFriendId ? 'received' : 'sent';
               chatMessages.appendChild(p);
               lastMessageId = message.id;
           }
       });
       chatMessages.scrollTop = chatMessages.scrollHeight; 
   }

   function startMessageUpdates() { 
      stopMessageUpdates(); 
      messageUpdateInterval = setInterval(loadChatMessages, 1000); 
  }

  function stopMessageUpdates() { 
      if (messageUpdateInterval) { 
          clearInterval(messageUpdateInterval); 
      } 
  }

// Function to send the message
function sendMessage() {
    const messageInputValue = messageInput.value.trim();
    if (messageInputValue && currentChatFriendId) {
        fetch('send_message.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `friend_id=${currentChatFriendId}&message=${encodeURIComponent(messageInputValue)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageInput.value = '';
                loadChatMessages();
            } else {
                alert('Failed to send message');
            }
        });
    }
}

// Event listener for the send button click
sendMessageButton.addEventListener('click', sendMessage);

// Event listener for the Enter key press in the message input
messageInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});


  document.getElementById('logout').addEventListener('click', function(e) { 
      e.preventDefault(); 
      stopMessageUpdates(); 
      fetch('logout.php') 
         .then(() => { 
             window.location.href='index.html'; 
         }); 
     });

     loadDashboardData();  
     setInterval(loadDashboardData, 10000);  
});