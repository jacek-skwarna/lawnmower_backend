var app = require('./server');
var port = Number(process.env.SERVER_PORT) || 8080;

var listener = app.listen(port, function() {
    console.log('REST server started. Server listenning on: %j', listener.address());
});