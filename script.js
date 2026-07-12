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

// --- 2. Hardcoded Frontend Authentication ---
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const userEmail = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    // Define the valid users, their passwords, and where they should be redirected
    const allowedUsers = {
        'employee@odoo.com': { password: 'password123', redirect: 'dashboard.html', role: 'Employee' },
        'admin@odoo.com':    { password: 'password123', redirect: 'admin.html', role: 'Admin' },
        'manager@odoo.com':  { password: 'password123', redirect: 'assetmanager.html', role: 'Manager' },
        'hod@odoo.com':      { password: 'password123', redirect: 'department_head.html', role: 'Head of Department' }
    };

    // Check if the typed email exists in our allowedUsers list
    const matchedUser = allowedUsers[userEmail];

    // Verify if user exists AND the password matches
    if (matchedUser && matchedUser.password === pass) {
        // Success!
        messageDiv.style.color = '#4ade80'; 
        messageDiv.style.display = 'block';
        messageDiv.innerText = `Login successful! Redirecting to ${matchedUser.role} portal...`;
        
        // Save the user data so the next page knows who logged in
        const userDataToSave = { email: userEmail, role: matchedUser.role };
        localStorage.setItem('loggedInUser', JSON.stringify(userDataToSave));
        
        // Redirect to their specific file
        setTimeout(() => {
            window.location.href = matchedUser.redirect;
        }, 800); 

    } else {
        // Failure: Wrong email or password
        messageDiv.style.color = '#f87171'; 
        messageDiv.style.display = 'block';
        messageDiv.innerText = 'Invalid email or password. Try again.';
    }
});