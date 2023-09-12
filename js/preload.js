// Initialize game controller
var FillyFoly = FillyFoly || {};

FillyFoly.Preload = function(){};

FillyFoly.Preload.prototype = {
 	preload: function() {
 		//set loading bar
 		this.preloadBar = this.game.add.sprite(this.game.width/2, this.game.height/2, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.game.load.setPreloadSprite(this.preloadBar);

        this.game.load.spritesheet('player-sheet', 'assets/gummy-sheet.png', 181, 155);
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('sky-overlay', 'assets/sky-overlay.png');
        this.game.load.image('vertical-bg-overlay', 'assets/vertical-bg-overlay.png');
        this.game.load.image('horizontal-bg-overlay', 'assets/horizontal-bg-overlay.png');
        this.game.load.image('clouds', 'assets/clouds.png');
        this.game.load.image('bg1', 'assets/bg1.png');
        this.game.load.image('bg2', 'assets/bg2.png');
        this.game.load.image('bg3', 'assets/bg3.png');
        this.game.load.image('bg4', 'assets/bg4.png');
        this.game.load.image('ground', 'assets/ground.png');
        this.game.load.image('obs-box1', 'assets/box1.png');
        this.game.load.image('obs-box2', 'assets/box2.png');
        this.game.load.image('obs-drum1-gray', 'assets/drumA-1.png');
        this.game.load.image('obs-drum2-gray', 'assets/drumA-2.png');
        this.game.load.image('obs-drum1-green', 'assets/drumB-1.png');
        this.game.load.image('obs-drum2-green', 'assets/drumB-2.png');
        this.game.load.image('obs-garbage', 'assets/garbage-can.png');
        this.game.load.image('obs-pipe1', 'assets/pipe.png');
        this.game.load.image('obs-bush1', 'assets/flower1.png');
        this.game.load.image('obs-bush2', 'assets/flower2.png');
        this.game.load.image('obs-bush3', 'assets/flower3.png');
        this.game.load.image('car1-upper', 'assets/car-upper.png');
        this.game.load.image('car1-lower', 'assets/car-lower.png');
        this.game.load.image('button-exit', 'assets/button-exit.png');
        this.game.load.image('button-profile', 'assets/button-profile.png');
        this.game.load.image('button-rank', 'assets/button-rank.png');
        this.game.load.image('button-backGame', 'assets/button-backGame.png');
        this.game.load.image('button-close', 'assets/button-close.png');
        this.game.load.image('button-facebook', 'assets/button-facebook.png');
        this.game.load.image('button-twitter', 'assets/button-twitter.png');
        this.game.load.bitmapFont('font-white', 'assets/font/font-white.png', 'assets/font/font-white.fnt');
        this.game.load.bitmapFont('font-pink', 'assets/font/font-pink.png', 'assets/font/font-pink.fnt');
    },

    update: function() {
    	this.game.state.start("Game");
    }
}