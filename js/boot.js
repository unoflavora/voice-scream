// Initialize game controller
var FillyFoly = FillyFoly || {};

FillyFoly.Boot = function(){};

FillyFoly.Boot.prototype = {
	preload: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

    	// assets we'll use in the loading screen
    	this.game.load.image('preloadbar', 'assets/preloader-bar.png');
	},
	create: function() {
	    // We're going to be using physics, so enable the Arcade Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Set the world bound
        this.game.world.setBounds(0, 0, this.game.width + 1000, this.game.height);
	  
	    this.game.state.start('Preload');
	}
}