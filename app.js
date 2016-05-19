
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

// Twitter oauth
var passport = require("passport");
var TwitterStrategy  = require("passport-twitter").Strategy;

var app = express();

// all environments
app.set('port', process.env.PORT || 8001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
// use passport
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});




passport.serializeUser(function (user, done) { done(null, user); });
passport.deserializeUser(function (obj, done) { done(null, obj); });



var ts = new TwitterStrategy({
	consumerKey: 'X5WBLiI9X4H6oPfS3Ngrx6aaJ',
	consumerSecret: 'QDYpjy0JYriMXO7fqCwZDDD5WXznkNIC9lreCLVvrQ9pFgF1NC',
	callbackURL: "http://192.168.1.202:8001/auth/twitter/callback"},
	function(token, tokenSecret, profile, done) {
		profile.twitter_token = token;
		profile.twitter_token_secret = tokenSecret;

		process.nextTick(function () {
			return done(null, profile);
		});
	}
);
passport.use(ts);


app.get('/', function(req, res) {
	res.render('index', { user: req.user });
});


app.get('/auth/twitter',
	passport.authenticate('twitter'),
	function(req, res){}
);


app.get('/auth/twitter/callback', 
	passport.authenticate('twitter', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	}
);
