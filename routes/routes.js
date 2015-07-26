module.exports = function(express, app, passport, config){
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
	
	router.get('/logout', function(req, res, next){
		req.logout();
		res.redirect('/');
	})
	
	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook',{
		successRedirect:'/chatrooms',
		failureRedirect:'/'
	}))
	router.get('/chatrooms', securePages, function(req, res, next){
		res.render('chatrooms', {title : 'Welcome to my chatroom!', user:req.user, config:config});
	})
	
	app.use('/', router);
}
