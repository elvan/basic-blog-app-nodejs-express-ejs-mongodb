const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/posts');
});

router.get('/posts', (req, res) => {
  res.render('posts-list');
});

router.get('/new-post', async (req, res) => {
  db.getDb()
    .collection('authors')
    .find({})
    .toArray((err, authors) => {
      if (err) {
        console.log(err);
        return;
      }
      res.render('create-post', { authors });
    });
});

module.exports = router;
