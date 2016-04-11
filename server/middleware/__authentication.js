module.exports = function() {
  return function authenticate(req, res, next) {
    console.log(' ');
    console.log('----------------------------');
    console.log('Request authentication on on %s', req.url);
    console.log('----------------------------');
    
    console.log(JSON.stringify(req.query['access_token']));
    var httpRequest = require('request');
    
    httpRequest('http://www.google.com', function (error, response, body){
    if (!error && response.statusCode === 200) 
    {
        console.log('ok');
        next();
    }
    else
    {
        console.log('ko');
        var errorObj = {message: 'Authentication required', status: 401};
        
        res.status(401);
        res.json(errorObj);
    }
    });
    
    console.log('----------------------------');
  };
};