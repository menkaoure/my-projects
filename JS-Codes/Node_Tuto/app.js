var flash = require('connect-flash');
var express = require('express');
var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy;

var app = express();

var port = 4000;
var users = [
	{id: 1, username: 'alex', password: 'xela', email: 'alex@example.com'},
	{id: 2, username: 'bob', password: 'bob', email: 'bob@example.com'}
];

function findById(id, fn) {
	var idx = id - 1;
	if(users[idx]) {
		fn(null, users[idx])
	} else {
		fn(new Error('User with id ' + id + 'does not exist'));
	}
}

function findByUsername(username,fn) {
	for(var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if(user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}

passport.serializeUser(function(user, done) {
	done(null, user.id)
});

passport.deserializeUser(function(id, done) {
	findById(id, function(err, user) {
		done(err, user);
	});
});


passport.use(new LocalStrategy( 
	function(username, password, done) {
		process.nextTick(function() {
			findByUsername(username, function(err, user) {
				if(err) {
					return done(err);
				}
				if(!user) {
					return done(null, false, {message: 'Incorrect username.'});
				}
				if(user.password != password) {
					return done(null, false, {message: 'Incorrect password.'});
				}
				return done(null, user);
			});
		})
	}
));

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.logger());
	app.use(express.cookieParser('cookie parser'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({cookie: {maxAge: 60000}, key: 'session pass'}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(app.router);
	app.use(express.static(__dirname));
});

app.get('/', function(req, res) {
	res.render('index.ejs', {message: req.flash('error')});
})
/*
.get('/todo/login', function(req, res) {
	res.render('login', {user: req.user, message: req.flash('error')});
}) */
.get('/todo', ensureAuthenticated, function(req, res) {
	var tasksList = ['task0', 'task1', 'task2'];

	res.render('todolist.ejs', {title: 'Todo List', tasks: tasksList});
})

/* POST /login */
app.post('/todo/login', 
	passport.authenticate('local', {
		failureRedirect: '/',
		failureFlash: true
	}), function(req, res) {
		res.redirect('/todo');
});

app.listen(port, function() {
	console.log('Server start and listening on port ' + port + ' ...');
});

function ensureAuthenticated(req,res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/todo/login');
}