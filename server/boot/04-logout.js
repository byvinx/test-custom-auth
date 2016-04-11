module.exports = function(app) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
    console.log('Run 04-logout.js');
  
    var CONFIG = app.get('config');
    var USER_SESSION_NAME = CONFIG.session.userSessionName;
  
    var router = app.loopback.Router();
   
    router.all('/logout', function(req, res, next){

    console.log(' ');
    console.log('----------------------------');
    console.log('Request logout on on %s', req.url);
    console.log('----------------------------');
  
    if (req.session && req.session[USER_SESSION_NAME]) 
    {
        var successMessage = 'LOGOUT: OK FOR USER: ' + req.session[USER_SESSION_NAME];
			
        req.session[USER_SESSION_NAME] = '';
        
        console.log(successMessage);
        
        res.status(200);
        res.json(successMessage);
    }
    else
    {
        var errMessage = 'ERROR: NO SESSION FOUND FOR THE CLIENT - LOGOUT: FAILED';
        console.log(errMessage);
        var errorObj = {message: errMessage, status: 401};
        
        res.status(401);
        res.json(errorObj);
    }
    });
   
   app.use(router);
};
