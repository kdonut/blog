const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.redirect('/posts');//jak redirect to na sciezke nie template
  });

  router.get('/posts', (req, res) => {
    res.render('posts-list'); //parse template by engine template
  });

  router.get('/new-post', (req, res) => {
    res.render('create-post'); //parse template by engine template
  });

  module.exports = router;