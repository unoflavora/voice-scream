// Initialize Global Variables
var audioContext = null;
var meter = null;
var loopFunction = null;
var mediaStreamSource = null;
var stream;
var startBtn = document.getElementById("start");

// Initialize game controller
var FillyFoly = FillyFoly || {};

//Read volume-meter.js
window.onload = function() {    
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        // ask for an audio input
            navigator.mediaDevices.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            }).then(s => {
                stream = s;
                
                //check browser
                var chrome   = navigator.userAgent.indexOf('Chrome') > -1;
                var explorer = navigator.userAgent.indexOf('MSIE') > -1;
                var firefox  = navigator.userAgent.indexOf('Firefox') > -1;
                var safari   = navigator.userAgent.indexOf("Safari") > -1;
                var camino   = navigator.userAgent.indexOf("Camino") > -1;
                var opera    = navigator.userAgent.toLowerCase().indexOf("op") > -1;
                if ((chrome) && (safari)) safari = false;
                if ((chrome) && (opera)) chrome = false;

                //check safari
                if (safari) {
                    start.style.display = "flex";
                }
                else {
                    gotStream();
                }
            }).catch(didntGetStream);
    } catch (e) {
        alert('Perangkat anda tidak mendukung game ini. Mohon gunakan Safari 11.2+ pada iOS atau Chrome pada Android.');
    }
}

function didntGetStream() {
    startBtn.style.display = 'none';
    // Create game canvas
    FillyFoly.game = new Phaser.Game(720 * window.innerWidth / window.innerHeight, 720, Phaser.CANVAS, "");

    // Show no mic detected state
    FillyFoly.game.state.add("NoMic",FillyFoly.noMicDetected);
    FillyFoly.game.state.start("NoMic");

    // no mic debugging
    //FillyFoly.game.state.add("Boot",FillyFoly.Boot);
    //FillyFoly.game.state.add("Preload",FillyFoly.Preload);
    //FillyFoly.game.state.add("Game",FillyFoly.Game);
    //FillyFoly.game.state.add("End Game",FillyFoly.endGame);

    // Start the game
    //FillyFoly.game.state.start("Boot");
}

function gotStream() {
    startBtn.style.display = 'none';
    // Create game canvas
    FillyFoly.game = new Phaser.Game(720 * window.innerWidth / window.innerHeight, 720, Phaser.CANVAS, "");

    // Assign game states
    FillyFoly.game.state.add("Boot",FillyFoly.Boot);
    FillyFoly.game.state.add("Preload",FillyFoly.Preload);
    FillyFoly.game.state.add("Game",FillyFoly.Game);
    FillyFoly.game.state.add("End Game",FillyFoly.endGame);

    // Start the game
    FillyFoly.game.state.start("Boot");
    
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    getMicMeter();
}

function getMicMeter(time) {
    // get meter value
    FillyFoly.micMeter = meter.volume;

    // set up the next visual callback
    loopFunction = window.requestAnimationFrame(getMicMeter);
}
