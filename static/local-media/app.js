var myVideoStream = null,
    myVideo       = null;

window.onload = function() {
    myVideo = document.getElementById('myVideo');
    getUserMedia({audio: true, video: true}, gotUserMedia, didntGetUserMedia);
};

function gotUserMedia(stream) {
    attachMediaStream(myVideo, stream);
}

function didntGetUserMedia() {
    console.log('Could not get video');
}
