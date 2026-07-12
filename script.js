// --- 1. Password Visibility Toggle ---
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');

togglePassword.addEventListener('click', function () {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    
    if (isPassword) {
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
});

// --- 2. REAL Authentication Form Submit ---
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    try {
        // Send the typed credentials to your Node.js backend
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Package the data up nicely for the server
            body: JSON.stringify({ username: user, password: pass }) 
        });

        const data = await response.json();

        if (response.ok) {
            // Success! The server verified the password against the database.
            messageDiv.style.color = '#4ade80'; 
            messageDiv.style.display = 'block';
            messageDiv.innerText = 'Login successful! Redirecting...';
            
            // Save the user data so the dashboard can display their actual name
            localStorage.setItem('loggedInUser', JSON.stringify(data.user));
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800); 
        } else {
            // The server rejected the credentials (wrong email or password)
            messageDiv.style.color = '#f87171'; 
            messageDiv.style.display = 'block';
            messageDiv.innerText = data.error || 'Invalid email or password. Try again.';
        }
    } catch (error) {
        // If the backend isn't running, show a connection error
        messageDiv.style.color = '#f87171'; 
        messageDiv.style.display = 'block';
        messageDiv.innerText = 'Cannot connect to the server. Is it running?';
        console.error('Login error:', error);
    }
});