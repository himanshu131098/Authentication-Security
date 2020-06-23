require('dotenv').config()
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');

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
  password: String,
  googleId:String,
  facebookId:String,
  secret:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] }));

app.get('/auth/google/secrets',
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/secrets');
});

app.get("/auth/facebook",
  passport.authenticate("facebook", {scope:["profile"] }));

app.get("/auth/facebook/secrets",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/secrets",function(req,res){
  User.find({"secret":{$ne:null}}, function(err,foundUsers){
    if(err){
      console.log(err);
    }else{
      if(foundUsers){
        res.render("secrets",{userWithSecrets:foundUsers});
      }
    }
  });
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

app.get("/submit",function(req,res){
  if(req.isAuthenticated()){
    res.render("submit");
  }else{
    res.redirect("/login");
  }
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

app.post("/submit",function(req,res){
  const submittedSecret = req.body.secret;

  User.findById(req.user.id, function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        foundUser.secret = submittedSecret;
        foundUser.save(function(){
          res.redirect("/secrets");
        });
      }
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
