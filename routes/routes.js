module.exports = function(express, app, passport){
	var router = express.Router();
	
	router.get('/', function(req, res, next){
		res.render('index', {title : 'Welcome to chatcat!'});
	})
	
	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook',{
		successRedirect:'/chatrooms',
		failureRedirect:'/'
	}))
	router.get('/chatrooms', function(req, res, next){
		res.render('chatrooms', {title : 'Welcome to my chatroom!', user:req.user});
	})
	
	router.get('/setcolor', function(req, res, next){
		req.session.favColor = "Red";
		res.send('Setting fav color');
	})
	
	router.get('/getcolor', function(req, res, next){
		res.send('Fav color: ' + (req.session.favColor==undefined ? "Not found" : req.session.favColor));
	})

	app.use('/', router);
}
