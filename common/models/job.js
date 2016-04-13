var app = require('../../server/server'); //require `server.js` app

var CONFIG = app.get('config');
var USER_SESSION_NAME = CONFIG.session.userSessionName;
  
module.exports = function(Job) {
 
  Job.beforeRemote('create', function(context, modelInstance, next) {
    console.log('---------------START beforeRemote--------------------');
    console.log(context.methodString, 'was invoked remotely');
    
    next();
  });
  
 //Filter owner's record add check in where clause
 Job.beforeRemote('**', function(context, modelInstance, next) {
    console.log('---------------START beforeRemote--------------------');
    console.log(context.methodString, 'was invoked remotely');
    
    var req = context.req;
    var session = req.session;
    
    var authUser = session[USER_SESSION_NAME];
    
    console.log('SESSION USER: ' + authUser);
    
    var inputFilter = context.args.filter;
    
    var inputFilterObj;
  
    if(inputFilter)
    {
        console.log('FOUND INPUT FILTER: ' + inputFilter);
        
        inputFilterObj = JSON.parse(inputFilter);
        inputFilterObj.where.owner = authUser;//addind owner prop
        
        //context.args.filter = {'where': {'and': [{'name':'Richard'},{'owner':'project'}]}};
        //newClause = {'where': {'and': [inputWhereClause, {'owner':authUser}]}};
    }
    else
    {
        console.log('NO FOUND INPUT FILTER');
        
        inputFilterObj = {'where': {'owner':authUser}}; 
    }
    
     var inputFilterStr = JSON.stringify(inputFilterObj);
     context.args.filter = inputFilterStr;
     
     console.log('INPUT FILTER SETTED TO: ' + inputFilterStr);
    
     next();
  });
  
  /*
  Job.afterRemote('**', function(context, modelInstance, next){
    console.log('START afterRemote');
    console.log(context.methodString, 'was invoked remotely');
  
    if (context.result) 
    {
        var req = context.req;
        var session = req.session;
    
        var authUser = session[USER_SESSION_NAME];
    
        console.log('SESSION USER: ' + authUser);
    
        if (Array.isArray(modelInstance)) 
        {
            var answer = [];
            
            context.result.forEach(function(result){
                console.log('FIND OWNER: ' + result['owner'] + ' FOR RECORD WITH ID: ' + result['id']);
                if(result['owner'] === authUser)
                {
                    answer.push(result);
                }             
            });
            
            context.result = answer;
        } 
        else//is an object - {}
        {
            console.log(JSON.stringify(context.result));
            console.log('FIND OBJECT');
            console.log('FIND OWNER: ' + context.result['owner'] + ' FOR RECORD WITH ID: ' + context.result['id']);
            
            if(context.result['owner'])
            {
                if(context.result['owner'] !== authUser)
                {
                    context.result = {};
                }
            }
            else
            {
                console.log('REQUIRED RECORDS NOT CONTAIN OWNER ');
            }
        }
    }
    next();
  });
  */
};
