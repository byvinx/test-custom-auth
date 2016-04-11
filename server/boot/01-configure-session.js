module.exports = function(app) {
  
console.log('Run 01-configure-session.js');
  
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var CONFIG = app.get('config');

var fileStoreOptions = CONFIG.session.fileStoreOptions;
var sessionOptions = CONFIG.session.sessionOptions;

sessionOptions.store = new FileStore(fileStoreOptions);
sessionOptions.store = new FileStore(fileStoreOptions);

app.use(session(sessionOptions));

};
