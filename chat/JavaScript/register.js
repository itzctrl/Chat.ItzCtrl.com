document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = this.username.value;
        const password = this.password.value;
        const confirmPassword = this.confirmPassword.value;

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        // If passwords match, proceed with registration
        fetch('register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Registration successful! You can now log in.");
                window.location.href = 'index.html'; // Redirect to login page
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred during registration. Please try again.");
        });
    });
});