const express = require("express");
const { get } = require("express/lib/response");
const router = express.Router();

const db = require("../data/database"); //import modulu pool z database.js

router.get("/", (req, res) => {
  res.redirect("/posts"); //jak redirect to na sciezke nie template
});

router.get("/posts", async (req, res) => {
  const query = `SELECT posts.*, authors.name 
    FROM posts inner join authors on authors.id=posts.author_id`;

  const [posts] = await db.query(query);

  res.render("posts-list", { posts: posts }); //parse template by engine template
});

router.get("/new-post", async (req, res) => {
  const [authors] = await db.query("SELECT * FROM authors");
  res.render("create-post", { authors: authors }); //parse template by engine template
});

router.post("/posts", (req, res) => {
  const post = req.body;
  const data = [post.title, post.summary, post.content, post.author];
  db.query("INSERT INTO posts (title,summary,body,author_id) VALUES(?)", [
    data,
  ]);
  res.redirect("/posts");
});

//route to handle blog details

router.get("/posts/:id", async (req, res) => {
  const query = `SELECT posts.*, authors.name as author_name ,authors.email as author_email 
      FROM posts inner join authors on authors.id=posts.author_id where posts.id=?`;

  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }

  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanDate: posts[0].date.toLocaleDateString("pl-PL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  res.render("post-detail", { post: postData });
});

router.get("/posts/:id/edit", async (req, res) => {
  const query = "SELECT * FROM posts where id=?";
  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }

  res.render("update-post", { post: posts[0] });
});

router.post("/posts/:id/edit", async (req, res) => {
  const query = `
    UPDATE posts SET title = ?,summary = ?,body=? 
    wHERE id = ?
    `;
  await db.query(query, [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.params.id,
  ]);
  res.redirect("/posts");
});

router.post("/posts/:id/delete", async (req, res) => {
  await db.query("DELETE FROM posts where id=?", [req.params.id]);
  res.redirect("/posts");
});

module.exports = router;
