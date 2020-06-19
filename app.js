const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/register", function(req, res) {
  const newEmail = req.body.username;
  const newPassword = req.body.password;

  User.findOne({
    email: newEmail
  }, function(err, foundUser) {
    if (err) {
      res.render("error", {
        msg: "Error 404"
      });
    } else {
      if (foundUser) {
        res.render("error", {
          msg: "Already Existing User, Please Login!"
        });
      } else {
        const newUser = User({
          email: newEmail,
          password: newPassword
        });
        newUser.save();
        res.render("secrets")
      }
    }
  });
});

app.post("/login", function(req, res) {
  const email = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: email
  }, function(err, foundUser) {
    if (err) {
      res.render("error", {
        msg: "Error 404"
      });
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else{
          res.redirect("/login");
        }
        }
      else {
        res.render("error", {
          msg: "User not existing, please Register!"
      });
    }
    }
  });
});


app.listen(3000, function() {
  console.log("Server up and running at port 3000!");
});
