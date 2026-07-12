const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse URL-encoded bodies (sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve the static HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle the POST request from the login form
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials for testing demonstration
    const VALID_USERNAME = "admin";
    const VALID_PASSWORD = "Password123";

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // Successful login
        res.send(`<h1>Login Successful!</h1><p>Welcome back, ${username}.</p>`);
    } else {
        // Failed login
        res.status(401).send('<h1>Login Failed</h1><p>Invalid username or password. Go back and try again.</p>');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});