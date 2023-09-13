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
window.onload = async function() {  
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext = new AudioContext();
        const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
        const analyserNode = audioContext.createAnalyser();
        mediaStreamAudioSourceNode.connect(analyserNode);
    
        const pcmData = new Float32Array(analyserNode.fftSize);

        const onFrame = () => {
            analyserNode.getFloatTimeDomainData(pcmData);
            let sumSquares = 0.0;
            for (const amplitude of pcmData) { sumSquares += amplitude*amplitude; }
            FillyFoly.micMeter = Math.sqrt(sumSquares / pcmData.length);
            window.requestAnimationFrame(onFrame);
        };

        window.requestAnimationFrame(onFrame);

        gotStream();
        
    } catch (e) {
        alert('Perangkat anda tidak mendukung game ini. Mohon gunakan Safari 11.2+ pada iOS atau Chrome pada Android.');
        didntGetStream()
    }

    return;
}

function didntGetStream() {
    startBtn.style.display = 'none';
    // Create game canvas
    FillyFoly.game = new Phaser.Game(720 * window.innerWidth / window.innerHeight, 720, Phaser.CANVAS, "");

    // Show no mic detected state
    FillyFoly.game.state.add("NoMic",FillyFoly.noMicDetected);
    FillyFoly.game.state.start("NoMic");
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
}
