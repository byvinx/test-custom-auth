module.exports = function() {
  return function login(req, res, next) {
    console.log(' ');
    console.log('----------------------------');
    console.log('Request login on on %s', req.url);
    console.log('----------------------------');
    
    var httpRequest = require('request');
    
    httpRequest('http://www.google.com', function (error, response, body){
    if (!error && response.statusCode === 200) 
    {
        console.log('Login ok');
        
        res.status(200);
        res.json('LOGIN OK');
    }
    else
    {
        console.log('ko');
        var errorObj = {message: 'Login problem', status: 401};
        
        res.status(401);
        res.json(errorObj);
    }
    });

    console.log('----------------------------');
  };
};