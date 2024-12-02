const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let posts = [];
let name = "";
let securityLevel = "";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/html/index.html"));
});

app.get("/login", (req, res) => {
  name = req.query.name;
  securityLevel = "no seguro";
  res.render("test", { name, securityLevel });
});

app.post("/login", (req, res) => {
  name = req.body.name;
  securityLevel = "seguro";
  res.render("test", { name, securityLevel });
});

app.get("/home", (req, res) => {
  if (!name) {
    return res.redirect("/");
  }
  res.render("home", { name, posts });
});

app.post("/post", (req, res) => {
  const { title, content } = req.body;
  posts.push({ title, content });
  res.redirect("/home");
});

app.get("/post/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts[postId];
  if (!post) {
    return res.status(404).send("Publicación no encontrada.");
  }
  res.render("post", { post, postId });
});

app.post("/post/:id/edit", (req, res) => {
  const postId = req.params.id;
  const post = posts[postId];
  if (post) {
    post.title = req.body.title;
    post.content = req.body.content;
  }
  res.redirect(`/post/${postId}`);
});

app.post("/post/:id/delete", (req, res) => {
  const postId = req.params.id;
  posts = posts.filter((_, index) => index != postId);
  res.redirect("/home");
});

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
