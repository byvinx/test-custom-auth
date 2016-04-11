module.exports = function(app) {
  
  console.log('Run 03-checkAuth.js');
  
  var CONFIG = app.get('config');
  var USER_SESSION_NAME = CONFIG.session.userSessionName;
  
  var router = app.loopback.Router();
   
   router.all('/*', function(req, res, next){
   console.log(' ');
   console.log('----------------------------');
   console.log('Request auth on %s', req.url);
   console.log('----------------------------');

   if(req.session && req.session[USER_SESSION_NAME])
   {
       var successMessage = 'AUTHENTICATION OK FOR USER: ' + req.session[USER_SESSION_NAME];
       console.log(successMessage);
        
       next();
   }
   else
   {
       var errMessage = 'AUTHENTICATION FAILED - REQUIRED LOGIN';
       console.log(errMessage);
       var errorObj = {message: 'AUTH FAILED', status: 401};
       
       res.status(401);
       res.json(errorObj);
   }
   });
   
   app.use(router);
};
