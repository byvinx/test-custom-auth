var app = require('../../server/server'); //require `server.js` app

var CONFIG = app.get('config');
var USER_SESSION_NAME = CONFIG.session.userSessionName;
  
module.exports = function(Job) {
 Job.beforeRemote('find', function(context, user, next) {
    console.log('START beforeRemote for FIND');
    
    var req = context.req;
    var session = req.session;
    
    var authUser = session[USER_SESSION_NAME];
    
    console.log(authUser);
    
    var inputFilter = context.args.filter;
    
    var newClause;
    
    if(inputFilter)
    {
        var inputWhereClause = JSON.parse(inputFilter).where;
        //context.args.filter = {'where': {'and': [{'name':'Richard'},{'owner':'project'}]}};
        newClause = {'where': {'and': [inputWhereClause, {'owner':authUser}]}};
    }
    else
    {
        newClause = {'where': {'owner':authUser}};   
    }
   
    context.args.filter = newClause;
    console.log(newClause);
    //console.log(inputFilter);
    //console.log(inputWhereClause);
    
    next();
  });
  
   Job.afterRemote('find', function(context, user, next) {
    console.log('START afterRemote for FIND');
  
    //var result = context.result;
    //console.log(JSON.stringify(result));
   
    next();
  });
  
};
