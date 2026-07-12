const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to your 'odoo' database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'param', // <--- Change this to your real MySQL password
    database: 'odoo'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL. Check your password!', err.message);
        return;
    }
    console.log('Successfully connected to the Odoo database!');
});

// 2. Setup Route: Run this ONCE in your browser to create your admin user
app.get('/api/setup', async (req, res) => {
    // Add this right below your first setup route
app.get('/api/setup-employee', async (req, res) => {
    try {
        // Securely hash the password 'password123'
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const query = `
            INSERT INTO employees (full_name, email, password, department_id, role_id, status) 
            VALUES (?, ?, ?, NULL, ?, 'Active')
        `;
        
        // Notice we are using role_id: 4 (Normal Employee) this time!
        db.execute(query, ['Normal User', 'employee@odoo.com', hashedPassword, 4], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.send('Employee already exists!');
                }
                return res.status(500).send('Database error: ' + err.message);
            }
            res.send('Success! Normal employee created. Email: employee@odoo.com | Password: password123');
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});
    try {
        // Securely hash the password
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const query = `
            INSERT INTO employees (full_name, email, password, department_id, role_id, status) 
            VALUES (?, ?, ?, NULL, ?, 'Active')
        `;
        
        // Using role_id 1 (Admin) from your roles table
        db.execute(query, ['Param Naresh Mehta', 'param@odoo.com', hashedPassword, 1], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.send('User already exists! You are ready to log in.');
                }
                return res.status(500).send('Database error: ' + err.message);
            }
            res.send('Success! Test employee created. Email: param@odoo.com | Password: password123');
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// 3. The Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Check the employees table for the email
    const query = 'SELECT * FROM employees WHERE email = ? AND status = "Active"';
    
    db.execute(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        // If the email is not found
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const employee = results[0];

        // Compare the typed password with the securely hashed database password
        const match = await bcrypt.compare(password, employee.password);
        
        if (match) {
            res.status(200).json({ 
                message: 'Login successful', 
                user: { id: employee.employee_id, name: employee.full_name } 
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});

// 4. Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});