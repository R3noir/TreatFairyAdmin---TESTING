require('dotenv').config()
const express = require('express');
const app = express();
const Database = require('./private/Database.js');
const path = require('path');
const { error } = require('console');

app.use(express.json());

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

//Authentication
app.post('/api/auth', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await Database.auth.signInWithPassword({ email, password });
  if(error) {
    return res.status(200).json({ error: error.message});
  }
  else{
    Database.auth.signOut() //Remove this so u can continue the login process
    return res.status(200).json({ status: 'Successfully logged in'});
  }
});
