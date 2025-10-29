const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv').config();

// Create express app
const app = express();
const port = 3001; // Changed port to avoid conflict with React

// Enable CORS for React frontend
app.use(cors({
    origin: 'http://localhost:3000' // React default port
}));

// Parse JSON bodies
app.use(express.json());

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

// API Routes
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express!', name: 'Ananya' });
});

app.get('/api/users', (req, res) => {
    pool
        .query('SELECT * FROM teammembers;')
        .then(query_res => {
            res.json({ 
                success: true,
                data: query_res.rows 
            });
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).json({ 
                success: false, 
                error: 'Database query failed' 
            });
        });
});

app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});