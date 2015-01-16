var myVideoStream, myVideo;

window.onload = function() {
    myVideo = document.getElementById('myVideo');
    getMedia();
};

function getMedia() {
    getUserMedia({audio: true, video: true}, gotUserMedia, didntGetUserMedia);
}

function gotUserMedia(stream) {
    myVideoStream = stream;

    attachMediaStream(myVideo, myVideoStream);
}

function didntGetUserMedia() {
    console.log('could not get video');
}
