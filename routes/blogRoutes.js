const express = require('express');
const mongodb = require('mongodb');

const db = require('../data/database');

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/', (req, res) => {
  res.redirect('/posts');
});

router.get('/posts', async (req, res) => {
  const posts = await db
    .getDb()
    .collection('posts')
    .find({}, { title: 1, summary: 1, 'author.name': 1 })
    .toArray();

  res.render('posts-list', { posts });
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

router.post('/posts', async (req, res) => {
  const authorId = new ObjectId(req.body.author);
  const author = await db
    .getDb()
    .collection('authors')
    .findOne({ _id: authorId });

  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorId,
      name: author.name,
      email: author.email,
    },
  };

  await db.getDb().collection('posts').insertOne(newPost);

  res.redirect('/posts');
});

router.get('/posts/:id', async (req, res) => {
  const post = await db
    .getDb()
    .collection('posts')
    .findOne({ _id: new ObjectId(req.params.id) });

  if (!post) {
    return res.status(404).render('404');
  }

  post.humanDate = post.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  res.render('post-detail', { post });
});

router.get('/posts/:id/edit', async (req, res) => {
  const postId = req.params.id;

  const post = await db
    .getDb()
    .collection('posts')
    .findOne({ _id: new ObjectId(postId) });

  if (!post) {
    return res.status(404).render('404');
  }

  db.getDb()
    .collection('authors')
    .find({})
    .toArray((err, authors) => {
      if (err) {
        console.log(err);
        return;
      }
      res.render('update-post', { post, authors });
    });
});

router.post('/posts/:id', async (req, res) => {
  const postId = new ObjectId(req.params.id);

  const updatedPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
  };

  await db
    .getDb()
    .collection('posts')
    .updateOne({ _id: postId }, { $set: updatedPost });

  res.redirect(`/posts/${postId}`);
});

router.post('/posts/:id/delete', async (req, res) => {
  const postId = new ObjectId(req.params.id);

  await db.getDb().collection('posts').deleteOne({ _id: postId });

  res.redirect('/posts');
});

module.exports = router;
