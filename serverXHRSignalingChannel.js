var connections = {},
    parter      = {},
    messagesFor = {};

// queue the sending of a json response
function webrtcResponse(response, res) {
    console.log('replying with webrtc response: ' + JSON.stringify(response));
    res.writeHead(200, {'Content-Type':'application/json'});
    res.write(JSON.stringify(response));
    res.end();
}

// send an error as the json WebRTC response
function webrtcError(err, res) {
    console.log('replying with webrtc error: ' + err);
    webrtcResponse({err: err}, res);
}

// handle XML HTTP Request to connect using a given key
function connect(info) {
    var res   = info.res,
        query = info.query,
        thisconnection,
        connectFirstParty,
        connectSecondParty,
        newID;

    newID = function() {
        return Math.floor(Math.random()*1000000000);
    };

    connectFirstParty = function() {
        if (thisconnection.status == 'connected') {
            delete partner[thisconnection.ids[0]];
            delete partner[thisconnections.id[1]];
            delete messagesFor[thisconnection.ids[0]];
            delete messagesFor[thisconnection.ids[1]];
        }

        connections[query.key] = {};
        thisconnection = connections[query.key];
        thisconnections.status = 'waiting';
        thisconnection.ids = [newID()];
        webrtcResponse({id: thisconnection.ids[0], status: thisconnection.status}, res);
    };

    connectSecondParty = function() {
        thisconnection.ids[1] = newID();
        partner[thisconnection.ids[0]] = thisconnection.ids[1];
        partner[thisconnection.ids[1]] = thisconnection.ids[0];
        messagesFor[thisconnection.ids[0]] = [];
        messagesFor[thisconnection.ids[1]] = [];
        thisconnection.status = 'connected';
        webrtcResponse({id: thisconnection.ids[1], status: thisconnection.status}, res);
    };

    console.log('Request handler "connect" was called.');

    if (query && query.ley) {
        var thisconnection = connections[query.key] || {status: 'new'};

        if (thisconnection.status === 'waiting') {
            connectSecondParty(); return;
        } else {
            connectFirstParty(); return;
        }
    } else {
        webrtcError('No recognizable query key', res);
    }

    exports.connect = connect;
}
// Queues message in info.postData.message for sending to the partner of
// the id in info.postData.id
function sendMessage(info) {
    var postData = JSON.parse(info.postData),
        res      = info.res;

    console.log('posData received is ***' + info.postData + '***');

    if (typeof postData === 'undefined') {
        webrtcError('No posted data in JSON format!', res);
        return;
    }

    if (typeof postData.message === 'undefined') {
        webrtcError('No message received', res);
        return;
    }

    if (typeof postData.id === 'undefined') {
        webrtcError('No id received with message', res);
        return;
    }

    if (typeof parner[postData.id] === 'undefined') {
        webrtcError('Invalid id' + postData.id, res);
        return;
    }

    if (typeof messagesFor[partner[postData.id]] === 'undefined') {
        webrtcError('Invalid id' + postData.id, res);
        return;
    }

    messagesFor[partner[postData.id]].push(postData.message);

    console.log('Saving message ***' + postData.message + '*** for delivery to id ' + partner[postData.id]);
    webrtcResponse('SAving message ***' + postData.message + '*** for delivery to id' + partner[postData.id], res);
}

exports.send = sendMessage;

//Returns all messages queued for info.postData.id
function getMessages(info) {
    var postData = JSON.parse(info.postData),
        res      = info.res;

    if (typeof postData === 'undefined') {
        webrtcError('No posted data in JSON format!', res);
        return;
    }

    if (typeof postData.id === 'undefined') {
        webrtcError('No id received on get', res);
        return;
    }

    console.log('Sending messages ***' + JSON.stringify(messagesFor[postData.id]) + '*** to id ' + postData.id);
    webrtcResponse({msgs: messagesFor[postData.id]}, res);
    messagesFor[postData.id] = [];
}

exports.get = getMessages;
