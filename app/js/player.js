window.addEventListener(
    'DOMContentLoaded',
    init
);

function init(){
    e('#prog').value = 0;
    e('#volRange').value = e('#videoContainer').volume;
    bindEvents();
}

function bindEvents(){
    var video = e('#videoContainer');
    var progBar = e('#prog');
    var dropArea = e('#dropArea');

    video.addEventListener(
        'timeupdate',
        showProgress
    );

    video.addEventListener(
        'play',
        playing
    );

    video.addEventListener(
        'ended',
        ended
    );

    video.addEventListener(
        'pause',
        paused
    );

    video.addEventListener(
        'error',
        function(element){
            videoError('Video Error');
        }
    );

    video.addEventListener(
        'stalled',
        function(element){
            videoError('Video Stalled');
        }
    );

    dropArea.addEventListener(
        'dragleave',
        makeUnDroppable
    );

    dropArea.addEventListener(
        'dragenter',
        makeDroppable
    );

    dropArea.addEventListener(
        'dragover',
        makeDroppable
    );

    dropArea.addEventListener(
        'drop',
        loadVideo
    );

    e('#playerContainer').addEventListener(
        'click',
        playerClicked
    );

    e('#chooseVideo').addEventListener(
        'change',
        loadVideo
    );

    e('#volRange').addEventListener(
        'change',
        adjustVolume
    );

    window.addEventListener(
        'keyup',
        function(element){
            switch(element.keyCode){
                case 13 : //enter
                case 32 : //space
                    togglePlay();
                    break;
            }
        }
    );
}


function getTime(ms){

    var date = new Date(ms);
    var time = [];

    time.push(date.getUTCHours());
    time.push(date.getUTCMinutes());
    time.push(date.getUTCSeconds());

    return time.join(':');
}

function adjustVolume(element){
    var video = e('#videoContainer');
    video.volume=element.target.value;
}

function showProgress(){
    var video = e('#videoContainer');
    var progBar = e('#prog');
    var count = e('#count');
    progBar.value = (video.currentTime / video.duration);
    count.innerHTML = getTime(video.currentTime * 1000) + '/' + getTime(video.duration * 1000);
}

function togglePlay(){
    e('.play:not(.hide),.pause:not(.hide)').click();
}

function toggleScreen(){
    e('.fullscreen:not(.hide),.smallscreen:not(.hide)').click();
}

function playing(element){
    var player = e('#playerContainer');

    e('#play').classList.add('hide');
    e('#pause').classList.remove('hide');
    player.classList.remove('paused');

    hideFileArea();
}

function fullscreened(element){
    var player = e('#playerContainer');
    player.classList.add('fullscreened');
    player.webkitRequestFullscreen();

}


function smallscreened(element){
    var player = e('#playerContainer');
    player.classList.remove('fullscreened');
    document.webkitExitFullscreen();
}


function hideFileArea(){
    var dropArea = e('#dropArea');
    dropArea.classList.add('hidden');

    setTimeout(
        function(){
            var dropArea = e('#dropArea');
            dropArea.classList.add('hide');
        },
        500
    );
}

function showFileArea(){
    var dropArea = e('#dropArea');
    dropArea.classList.remove('hide');

    setTimeout(
        function(){
            var dropArea = e('#dropArea');
            dropArea.classList.remove('hidden');
        },
        10
    );
}

function paused(element){
    var player = e('#playerContainer');

    e('#pause').classList.add('hide');
    e('#play').classList.remove('hide');
    player.classList.add('paused');

    showFileArea();
}

function ended(element){
    var player = e('#playerContainer');

    e('#play').classList.remove('hide');
    e('#pause').classList.add('hide');
    player.classList.add('paused');

    showFileArea();
}

function makeDroppable(element) {
    element.preventDefault();
    element.target.classList.add('droppableArea');
};

function makeUnDroppable(element) {
    element.preventDefault();
    element.target.classList.remove('droppableArea');
};

function loadVideo(element) {
    element.preventDefault();
    var files = [];
    if(element.dataTransfer){
        files = element.dataTransfer.files;
    }else if(element.target.files){
        files = element.target.files;
    }else{
        files=[
            {
                type: 'video',
                path: element.target.value
            }
        ];
    }

    //@ToDo handle playlist
    for (var i = 0; i < files.length; i++) {
        console.log(files[i]);
        if(files[i].type.indexOf('video') > -1){
            var video = e('video');
            video.src = files[i].path;
            setTimeout(
                function(){
                    e('.dropArea').classList.remove('droppableArea');
                    e('.play:not(.hide),.pause:not(.hide)').click();
                },
                250
            );
        }
    };
};

function videoError(message){
    var err = e('#error');
    err.querySelector('h1').innerHTML = message;
    err.classList.remove('hide')

    setTimeout(
        function(){
            e('#error').classList.remove('hidden');
        },
        10
    );
}

function closeError(){
    e('#error').classList.add('hidden');
    setTimeout(
        function(){
            e('#error').classList.add('hide');
        },
        300
    );
}

function playerClicked(element){
    if(!element.target.id || element.target.id == 'controlContainer' || element.target.id == 'dropArea'){
        return;
    }

    var video = e('#videoContainer');
    var player = e('#playerContainer');

    switch(element.target.id){
        case 'video' :
            togglePlay();
            break;
        case 'play' :
            if(!video.videoWidth){
                videoError('请添加播放内容');
                return;
            }
            video.play();
            break;
        case 'pause' :
            video.pause();
            break;
        case 'volume' :
            e('#volRange').classList.toggle('hidden');
            break;
        case 'mute' :
            video.muted = (video.muted)? false:true;
            player.classList.toggle('muted');
            break;
        case 'volRange' :
            //do nothing for now
            break;
        case 'fullscreen' :
            fullscreened();
            break;
        case 'smallscreen' :
            smallscreened();
            break;
        case 'prog' :
            video.currentTime = ((element.offsetX) / element.target.offsetWidth) * video.duration;
            break;
        case 'close' :
            window.close();
            break;
        case 'fileChooser' :
            e('#chooseVideo').click();
            break;
        case 'error' :
        case 'errorMessage' :
            closeError();
            break;
        default :
            console.log('stop half assing shit.');
    }
}
