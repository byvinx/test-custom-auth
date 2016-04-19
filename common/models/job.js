var app = require('../../server/server'); //require `server.js` app

var CONFIG = app.get('config');
var USER_SESSION_NAME = CONFIG.session.userSessionName;
  
module.exports = function(Job) {
 
 Job.beforeRemote('**', function(context, modelInstance, next) {
    console.log('---------------START beforeRemote--------------------');
    console.log('context.methodString: ' + context.methodString);
    console.log('context.args: ' + JSON.stringify(context.args));
    
    var req = context.req;
    var session = req.session;
    
    var authUser = session[USER_SESSION_NAME];
    console.log('SESSION USER: ' + authUser);
    
    switch (context.methodString) 
    {
        case 'job.find':
        case 'job.findOne':
            var inputFilter = context.args.filter;
            var inputFilterObj;
        
            if(inputFilter)
            {
                console.log('FOUND INPUT FILTER: ' + inputFilter);
                
                inputFilterObj = JSON.parse(inputFilter);
                inputFilterObj.where.owner = authUser;//addind owner prop
            }
            else
            {
                console.log('NO FOUND INPUT FILTER');
                
                inputFilterObj = {'where': {'owner':authUser}}; 
            }
            
            var inputFilterStr = JSON.stringify(inputFilterObj);
            context.args.filter = inputFilterStr;
            
            console.log('INPUT FILTER SETTED TO: ' + inputFilterStr);
            break;
       case 'job.count':
       case 'job.updateAll':
        
        var inputWhereClause = context.args.where;
        
        var inputWhereObj;
  
        if(inputWhereClause)
        {
            console.log('FOUND INPUT WHERE CLAUSE: ' + inputWhereClause);
            
            inputWhereObj = JSON.parse(inputWhereClause);
            inputWhereObj.owner = authUser;//addind owner prop
        }
        else
        {
            console.log('NO FOUND INPUT FILTER');
            
            inputWhereObj = {'owner':authUser}; 
        }
        
        var inputWhereStr = JSON.stringify(inputWhereObj);
        context.args.where = inputWhereStr;
        
        console.log('INPUT FILTER MODIFY TO: ' + inputWhereStr);
        
        break;
       case 'job.create':
       context.args.data.owner = authUser;
       
    }
    next();
 });
 
 Job.afterRemote('**', function(context, modelInstance, next){
    console.log('---------------START afterRemote--------------------');
    console.log('context.methodString: ' + context.methodString);
    console.log('context.args: ' + JSON.stringify(context.args));
    
    var req = context.req;
    var session = req.session;
    
    var authUser = session[USER_SESSION_NAME];
    console.log('SESSION USER: ' + authUser);
    
    switch (context.methodString) 
    {
        case 'job.findById'://filtro in output perche' ignora la where
            if (context.result) 
            {
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
    }
    
    next();
 });
};
