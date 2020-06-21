const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

app.use(session({
 secret:"This is our SECRET!",
 resave:false,
 saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/secrets",function(req,res){
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/login");
  }
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res) {

  User.register({email:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res,function(){
         res.redirect("/secrets");
      });
    }
  });

});

app.post("/login", function(req, res) {

const user = new User({
  username:req.body.username,
  password:req.body.password
});

req.login(user,function(err){
  if(err){
    console.log(err);
    res.redirect("/login");
  }else{
    passport.authenticate("local")(req,res,function(){
      res.redirect("/secrets");
    });
  }
});

});



// app.post("/register", function(req, res) {
//   const newEmail = req.body.username;
//   const newPassword = req.body.password;
//
//   User.findOne({
//     email: newEmail
//   }, function(err, foundUser) {
//     if (err) {
//       res.render("error", {
//         msg: "Error 404"
//       });
//     } else {
//       if (foundUser) {
//         res.render("error", {
//           msg: "Already Existing User, Please Login!"
//         });
//       } else {
//         bcrypt.hash(newPassword, saltRounds, function(err, hash) {
//           const newUser = User({
//             email: newEmail,
//             password: hash
//           });
//           newUser.save();
//           res.render("secrets")
//         });
//       }
//     }
//   });
// });

// app.post("/login", function(req, res) {
//   const email = req.body.username;
//   const password = req.body.password;
//
//   User.findOne({
//     email: email
//   }, function(err, foundUser) {
//     if (err) {
//       res.render("error", {
//         msg: "Error 404"
//       });
//     } else {
//       if (foundUser) {
//         bcrypt.compare(password, foundUser.password, function(err, result) {
//           if (result === true) {
//             res.render("secrets");
//           } else{
//             res.redirect("/login");
//           }
//          });
//         }
//       else {
//         res.render("error", {
//           msg: "User not existing, please Register!"
//       });
//     }
//     }
//   });
// });


app.listen(3000, function() {
  console.log("Server up and running at port 3000!");
});
