// GET '/' Displays all of the mongooses.
// GET '/mongooses/:id' Displays information about one mongoose.
// GET '/mongooses/new' Displays a form for making a new mongoose.
// POST '/mongooses' Should be the action attribute for the form in the above route (GET '/mongooses/new').
// GET '/mongooses/edit/:id' Should show a form to edit an existing mongoose.
// POST '/mongooses/:id' Should be the action attribute for the form in the above route (GET '/mongooses/edit/:id').
// POST '/mongooses/destroy/:id' Should delete the mongoose from the database by ID.
const express = require("express");
const app = express();
var session = require("express-session");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("express-flash");

mongoose.connect("mongodb://localhost/panthos");

var PantherSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 1},
    level: {type: Number, required: true, minlength: 1},
    weapon: {type: String, required: true, minlength: 1}
}, {timestamps: true});
mongoose.model('Panther', PantherSchema);
var Panther = mongoose.model('Panther');

app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000}
}))
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, './views')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	Panther.find({}, function(err, panthers) {
		if(err) {
			console.log('we got an error');
		} else {
			console.log('success added panther_at_x');
			res.render('index', {stuff: panthers});
		}
	})
})
app.get('/panthers/new', function(req, res){
    res.render('new');
})

app.get('/panthers/:id', function(req, res){
	Panther.find({_id : req.params.id}, function(err, panther){
		if(err){
			console.log("panther/:id error ", err);
		}
		else{
			res.render('details', {magic: panther});
		}
	})
})



app.post('/panthers', function(req, res){
	console.log(req.body);
	var panther = new Panther({name: req.body.name, level: req.body.level, weapon: req.body.weapon});
	panther.save(function(err) {
		if(err){
			console.log('mistake', err);
			for (var x in err.errors){
				req.flash('famous', err.errors[x].message);
			}
		res.redirect('/');
		} else {
			console.log('successfully added panther');
			res.redirect('/');
		}
	});
});

app.listen(8000, function(){
    console.log("listening on port 8000");
})

