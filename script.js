// --- 1. Password Visibility Toggle ---
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');

togglePassword.addEventListener('click', function () {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    
    if (isPassword) {
        // Eye-slash icon (hide password)
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        // Normal eye icon (show password)
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
});

// --- 2. Mock Authentication Form Submit ---
document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Prevent the form from refreshing the page
    event.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    // Check credentials
    if (user === 'param' && pass === 'password123') {
        
        // 1. Show the success message
        messageDiv.style.color = '#4ade80'; 
        messageDiv.style.display = 'block';
        messageDiv.innerText = 'Login successful! Redirecting...';
        
        // 2. THIS IS THE NEW PART: Wait 0.8 seconds, then load the dashboard
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800); 

    } else {
        // Error state remains exactly the same
        messageDiv.style.color = '#f87171'; 
        messageDiv.style.display = 'block';
        messageDiv.innerText = 'Invalid username or password. Try again.';
    }
});