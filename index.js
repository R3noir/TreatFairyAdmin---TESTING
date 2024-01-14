const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for your HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/Login.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/Home.html'));
});

app.get('/resetpassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/ResetPassword.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));