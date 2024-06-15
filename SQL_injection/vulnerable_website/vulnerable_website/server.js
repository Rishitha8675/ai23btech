const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Enter your mysql password',
    database: 'vulnerable_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});


app.get('/users', (req, res) => {
    const search = req.query.search || '';
    const query = `SELECT * FROM users WHERE username LIKE '%${search}%'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});


app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            res.send('Login successful');
        } else {
            res.send('Login failed');
        }
    });
});


app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT username, email FROM users WHERE id = ${userId}`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});


app.get('/user/email', (req, res) => {
    const email = req.query.email;
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            res.send('Email found');
        } else {
            res.send('Email not found');
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
