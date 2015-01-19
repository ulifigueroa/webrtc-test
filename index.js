var port            = process.argv[2] || 5001,
    server          = require('./server'),
    requestHandlers = require('./serverXHRSignalingChannel'),
    handle          = {};

function fourohfour(info) {
    var res = info.res;
    console.log('Request handler fourohfour was called.');
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Page Not Found');
    res.end();
}

handle['/']         = fourohfour;
handle['/connect']  = requestHandlers.connect;
handle['/send']     = requestHandlers.send;
handle['/get']      = requestHandlers.get;

server.serveFilePath('static');
server.start(handle, port);
