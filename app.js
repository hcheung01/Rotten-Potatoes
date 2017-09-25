var express = require('express')
var exphbs = require('express-handlebars')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes', { useMongoClient: true, })
// add body-parser to app (after initializing above)
app.use(bodyParser.urlencoded({ extended: true }))
// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

var Review = mongoose.model('Review', {
    title: String,
    movieTitle: String,
    rating: Number,
    description: String
})

//GET review index
app.get('/', function (req,res) {
    Review.find(function(err, reviews) {
        if (err) {
            console.log(err)
            return
        }
        res.render('reviews-index', {reviews: reviews})
    })
})

//GET new index form
app.get('/reviews/new', function (req, res) {
    res.render('reviews-new', {})
})

//GET specific review
app.get('/reviews/:id', function (req, res) {
    Review.findById(req.params.id).exec(function (err, review) {
        res.render('reviews-show', {review: review})
    })
})

//GET specific review edit form
app.get('/reviews/:id/edit', function (req, res) {
    Review.findById(req.params.id, function (err, review) {
        res.render('reviews-edit', {review: review})
    })
})

//POST(create) new review
app.post('/reviews', function (req, res) {
    Review.create(req.body, function(err, review) {
        console.log(review)

        res.redirect('/reviews/' + review._id)
    })
})

//PUT(update) specific review
app.put('/reviews/:id', function (req, res) {
    Review.findByIdAndUpdate(req.params.id, req.body, function(err, review) {
        res.redirect('/reviews/' + review._id)
    })
})

//DELETE specific review
app.delete('/reviews/:id', function (req, res) {
    Review.findByIdAndRemove(req.params.id, function(err) {
        res.redirect('/')
    })
})

app.listen(process.env.PORT || 3000, function(){
    console.log('Portfolio App listening on port 3000!')
})
