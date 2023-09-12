// Initialize game controller
var FillyFoly = FillyFoly || {};

FillyFoly.noMicDetected = function(){};

FillyFoly.noMicDetected.prototype = {
	preload: function() {
        this.game.load.bitmapFont('font-white', 'assets/font/font-white.png', 'assets/font/font-white.fnt');
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
	},
    create: function(){
        var noMic = this.game.add.bitmapText(this.game.width/2, this.game.height/2, 'font-white', 'No Mic', 48);
        noMic.anchor.set(0.5);
    }
}