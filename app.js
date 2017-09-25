var express = require('express')
var methodOverride = require('method-override')
var app = express()

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var Review = mongoose.model('Review', {
  title: String,
  description: String,
  movieTitle: String
});

mongoose.connect('mongodb://localhost/rotten-potatoes');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.listen(3000, function () {
  console.log('Portfolio App listening on port 3000!')
})

// INDEX
app.get('/', function (req, res) {
  Review.find(function(err, reviews) {
    res.render('reviews-index', {reviews: reviews});
  })
})

// NEW
app.get('/reviews/new', function (req, res) {
  res.render('reviews-new', {});
})

// CREATE
app.post('/reviews', function (req, res) {
  Review.create(req.body, function(err, review) {
    res.redirect('/reviews/' + review._id);
  })
})

// SHOW
app.get('/reviews/:id', function (req, res) {
  Review.findById(req.params.id).exec(function (err, review) {
    res.render('reviews-show', {review: review});
  })
});

// EDIT
app.get('/reviews/:id/edit', function (req, res) {
  Review.findById(req.params.id, function(err, review) {
    res.render('reviews-edit', {review: review});
  })
})

// UPDATE
app.put('/reviews/:id', function (req, res) {
  Review.findByIdAndUpdate(req.params.id,  req.body, function(err, review) {
    res.redirect('/reviews/' + review._id);
  })
})

// DELETE
app.delete('/reviews/:id', function (req, res) {
  Review.findByIdAndRemove(req.params.id, function(err) {
    res.redirect('/');
  })
})
