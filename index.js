const express = require('express');
require('dotenv').config()
const supabase = require('@supabase/supabase-js')

const path = require('path');
const app = express();
const Database = supabase.createClient(process.env.URL, process.env.KEY)
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
app.post('/auth', async (req, res) => {
  Database.auth.signOut();
  const { email, password } = req.body;
  const { data, error } = await Database.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({ data });
});
