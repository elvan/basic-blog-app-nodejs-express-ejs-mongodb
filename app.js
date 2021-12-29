const path = require('path');

const express = require('express');

const db = require('./data/database');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Parse incoming JSON data
app.use(express.json());

// Serve static files (e.g. CSS files)
app.use(express.static('public'));

app.use(blogRoutes);

// Default error handling function
// Will become active whenever any route / middleware crashes
app.use(function (error, req, res, next) {
  console.log(error);
  res.status(500).render('500');
});

db.connect().then(() => {
  console.log('Connected to MongoDB');

  // Start the server
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
});
