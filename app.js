const express = require('express');
const path = require('path');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();
const userDataFile = require('./data.json');
const session = require('express-session');
const fs = require('fs');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017/videoGameCollectionTest';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/videoGameCollectionTest');
const Game = require("./models/model");

app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000, httpOnly: false}}));
const main = require("./public/main.js");
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
function getUser(username){
  return userDataFile.users.find(function (user) {
    return user.username.toLowerCase() == username.toLowerCase();
  });
}


app.get("/", function (req, res) {
  Game.find().then(function (games) {
    res.render('index', {games: games});
  })
});
app.post("/", function (req, res) {
  res.redirect('/');
});


app.get("/add", function (req, res) {
  res.render("add");
});
app.post("/add", function (req, res) {
  res.redirect('/add');
});


app.get('/:id/addsave/', function (req, res) {
  Game.findOne({_id: req.params.id}).then(function (game) {
    res.render("addsave", {game: game});
  })
})
app.post('/:id/newsave/', function (req, res) {
  Game.findOne({_id: req.params.id}).then(function (game) {
    game.saves.push(req.body);
    game.save().then(function () {
      res.redirect("/")
    })
  })
})


app.get('/:id/editgame/', function (req, res) {
  Game.findOne({_id: req.params.id}).then(function (game) {
    res.render("editgame", {game:game});
  })
})
app.post('/:id/editgame/', function (req, res) {
  Game.findOne({_id: req.params.id}).then(function (game) {
    game.name = req.body.name;
    game.developer = req.body.developer;
    game.isitgood = req.body.isitgood;
    game.save().then(function () {
    res.render("editgame", {game:game});
    })
  })
})


app.post('/createnew', function (req, res) {
  Game.create(req.body)
  .then(function (game) {
    res.redirect('/');
  })
  .catch(function (error) {
    res.redirect('/add');
  })
});





app.get("/:dynamic", function (req, res) {
  console.log("DYNAMIC TRIGGERED:")
  console.log(req.params.dynamic);
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('Hosted on local:3000');
})
