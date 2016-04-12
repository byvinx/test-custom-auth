module.exports = function(app) {
    console.log('Run 02-login.js');
  
    var CONFIG = app.get('config');
    var USER_SESSION_NAME = CONFIG.session.userSessionName;
  
    var router = app.loopback.Router();
   
    router.all('/login', function(req, res, next){

    console.log(' ');
    console.log('----------------------------');
    console.log('Request login on on %s', req.url);
    console.log('----------------------------');
    
    //console.log(JSON.stringify(req.query['access_token']));
   
    //var httpRequest = require('request');
    //httpRequest('http://www.google.com', function (error, response, body){});
    
    if (req.query.username ==='admin' || req.query.username === 'project')//fake check 
    {
        if(req.session)//already created at client startup
        {
            var successMessage = 'LOGIN: OK - USERNAME: ' + req.query.username;
            console.log(successMessage);
            req.session[USER_SESSION_NAME] = req.query.username;
            
            res.status(200);
            res.json(successMessage);
        }
        else
        {
            var errMessage = 'SESSION MANAGEMENT SYSTEM ERROR: LOGIN: FAILED - USERNAME: ' + 'Administrator' + ' PASSWORD: ' + 'password';
            console.log(errMessage);
            
            res.status(500);
            res.json(errMessage);
        }
    }
    else
    {
        var errMessage = 'LOGIN: FAILED - USERNAME: ' + req.query.username + ' PASSWORD: ' + req.query.password;
        console.log(errMessage);
        var errorObj = {message: errMessage, status: 401};
        
        res.status(401);
        res.json(errorObj);
    }
   });
   
   app.use(router);
};
