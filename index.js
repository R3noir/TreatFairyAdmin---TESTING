require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes.js'); // Import your routes
const authRoutes = require('./authRoutes.js'); // Import your authentication routes

app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use your routes
app.use('/', routes);

// Use your authentication routes
app.use('/auth', authRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));