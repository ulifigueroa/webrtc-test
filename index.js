var server  = require('./server');
    port    = process.argv[2] || 5001;

function fourohfour(info) {
    var res = info.res;
    console.log('Request handler fourohfour was called.');
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Page Not Found');
    res.end();
}

var handle  = {};
handle['/'] = fourohfour;

server.serveFilePath('static');
server.start(handle, port);
