require('dotenv').config()
const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express();
const path = require('path');
const routes = require('./routes.js'); // Import your routes
const queryRoutes = require('./queryRoutes.js'); // Import your query routes
const authRoutes = require('./authRoutes.js'); // Import your authentication routes
const insertRoutes = require('./insertRoutes.js');
const updateRoutes = require('./updateRoutes.js');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 700
  });  

app.use(limiter);

app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use your routes
app.use('/', routes);

// Use your authentication routes
app.use('/auth', authRoutes);

app.use('/query', queryRoutes);

app.use('/insert', insertRoutes);

app.use('/update', updateRoutes);


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));