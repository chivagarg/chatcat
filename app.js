var express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js'),
	ConnectMongo = require('connect-mongo')(session),
	mongoose = require('mongoose').connect(config.dbURL),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	rooms = []

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

var env = process.env.NODE_ENV || 'development';

if (env == 'development')
{
	app.use(session({secret:config.sessionSecret}))
}
else
{
	app.use(session({
		secret:config.sessionSecret,
		store: new ConnectMongo({
			//url: config.dbURL,
			mongoose_connection:mongoose.connections[0],
			stringify:true
		})
	}))
}

app.use(passport.initialize());
app.use(passport.session());
var userSchema = mongoose.Schema({
	username:String,
	password:String,
	fullname:String
})

// var Person = mongoose.model('users', userSchema);

// var John = new Person({
	// username:'johndoe',
	// password:'john_pwd',
	// fullname:'John Doe'
// })

// John.save(function(err){
	// console.log('Done');
// });

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);
require('./routes/routes.js')(express, app, passport, config);
// app.listen(3000, function(){
	// console.log('ChatCat working on port 3000');
	// console.log("Mode: " + env);
// })

app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);

server.listen(app.get('port'), function(){
	console.log('ChatCat on Port : ' + app.get('port'));
})