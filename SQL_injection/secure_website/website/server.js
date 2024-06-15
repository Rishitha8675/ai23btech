const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_sql_password',
    database: 'vulnerable_db'
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Secure endpoint to search users
app.get('/search', (req, res) => {
    const search = req.query.search;
    const query = 'SELECT username, email FROM users WHERE username LIKE ?';
    pool.execute(query, [`%${search}%`], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Secure endpoint to login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    pool.execute(query, [username, password], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.send('Login successful');
        } else {
            res.send('Invalid username or password');
        }
    });
});

// Secure endpoint to get user info by ID
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT username, email FROM users WHERE id = ?';
    pool.execute(query, [userId], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Secure endpoint to check email
app.post('/check-email', (req, res) => {
    const email = req.body.email;
    const query = 'SELECT * FROM users WHERE email = ?';
    pool.execute(query, [email], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.send('Valid email id');
        } else {
            res.send('Email Not Found');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
