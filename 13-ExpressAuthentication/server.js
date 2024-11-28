require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/LOTR", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  googleId: String,
  secret: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

// Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, (err, user) => done(err, user));
    }
  )
);

// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/register", (req, res) => res.render("register.ejs"));

app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username, email: req.body.email },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => res.redirect("/secrets"));
      }
    }
  );
});

app.get("/login", (req, res) => res.render("login.ejs"));

app.post("/login", passport.authenticate("local", { successRedirect: "/secrets", failureRedirect: "/login" }));

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    User.find({ secret: { $ne: null } }, (err, users) => {
      if (err) console.log(err);
      res.render("secrets.ejs", { usersWithSecrets: users });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit.ejs");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", (req, res) => {
  const submittedSecret = req.body.secret;

  User.findById(req.user.id, (err, foundUser) => {
    if (err) console.log(err);
    if (foundUser) {
      foundUser.secret = submittedSecret;
      foundUser.save(() => res.redirect("/secrets"));
    }
  });
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/secrets")
);


app.listen(3000, () => console.log("Listening on port 3000"));
