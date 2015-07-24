module.exports = function(express, app, passport){
	var router = express.Router();
	
	router.get('/', function(req, res, next){
		res.render('index', {title : 'Welcome to chatcat!'});
	})
	
	// Secure pages middleware
	function securePages(req, res, next){
		if (req.isAuthenticated()){
			next();
		}
		else{
			res.redirect('/');
		}
	}
	
	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook',{
		successRedirect:'/chatrooms',
		failureRedirect:'/'
	}))
	router.get('/chatrooms', securePages, function(req, res, next){
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
