// Initialize game controller
var FillyFoly = FillyFoly || {};

FillyFoly.globalScore = 0;
FillyFoly.speed = 300;
FillyFoly.pixelPerMeter = 200;
FillyFoly.BaloonHeight = 250;
FillyFoly.BaloonTime = 1300;
FillyFoly.obstacleNames = ['obs-box1', 'obs-box2', 'obs-pipe1', 'obs-garbage'];
FillyFoly.coloredObs = ['obs-drum1', 'obs-drum2'];
FillyFoly.colorNames = ['gray', 'green'];
FillyFoly.carNames = ['car1'];
FillyFoly.dangerousObs = ['obs-bush1', 'obs-bush2', 'obs-bush3'];
FillyFoly.earlyObs = ['obs-bush3', 'obs-drum1-gray', 'car1'];
FillyFoly.gameOver;

// debug
FillyFoly.micMeter = 0;

FillyFoly.Game = function(){};

FillyFoly.Game.prototype = {
    create: function() {
        // restart state
        FillyFoly.gameOver = false;
        
        // A background for our game
        this.sky = this.game.add.sprite(0, 0, 'sky');
        this.sky.width = this.game.width;
        this.sky.height = this.game.height;


        this.sky = this.game.add.sprite(0, 0, 'sky-overlay');
        this.sky.width = this.game.width;
        this.sky.height = this.game.height;

        this.clouds = this.game.add.tileSprite(0, 0, this.game.world.width, 720, 'clouds');

        this.bg4 = this.game.add.tileSprite(0, this.game.world.height, this.game.world.width, 720, 'bg4');
        this.bg4.anchor.set(0,1);

        this.bg3 = this.game.add.tileSprite(0, this.game.world.height, this.game.world.width, 720, 'bg3');
        this.bg3.anchor.set(0,1);

        this.bg2 = this.game.add.tileSprite(0, this.game.world.height, this.game.world.width, 720, 'bg2');
        this.bg2.anchor.set(0,1);

        this.bg1 = this.game.add.tileSprite(0, this.game.world.height, this.game.world.width, 720, 'bg1');
        this.bg1.anchor.set(0,1);

        // Adding grounds
        this.ground = this.game.add.tileSprite(0, this.game.world.height - 75, this.game.world.width, 75, 'ground');

        // We will enable physics for any object that is created in this group
        this.game.physics.arcade.enable(this.ground);

        // This stops it from falling away when you jump on it
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        // The player and its settings
        this.player = this.game.add.sprite(80, this.game.world.height - 75, 'player-sheet');
        this.player.anchor.set(0.5,1);

        // We need to enable physics on the player
        this.game.physics.arcade.enable(this.player);
        this.player.body.setSize(65,152,80,0);
        
        // Player physics properties
        this.player.body.gravity.y = 2000;

        // Our animations
        this.player.animations.add('skate', [0, 1, 2, 3], 8, true);
        this.player.animations.add('jump', [4, 5, 6, 7], 10, true);
        this.player.animations.add('drop', [15, 16], 10, true);
        this.player.animations.add('inflate', [8], 10, true);
        this.player.animations.add('deflate', [13], 10, true);
        this.player.animations.add('baloon', [9, 10, 11, 12], 8, true);
        this.player.frame = 0;

        // Score text
        FillyFoly.globalScore = 0;
        this.scoreText = this.game.add.bitmapText(16, 16, 'font-pink', 'Score: 0 m', 32);
        
        // Button
        // this.profileButton = this.game.add.button(this.game.width - 140, 15, 'button-profile', goToProfile, this);
        // this.exitButton = this.game.add.button(this.game.width - 70, 15, 'button-exit', OpenPopUpLogout, this);

        // Debug text
        //this.game.add.text(16, 64, 'Debug: ', { fontSize: '24px', fill: '#FFF' });
        //this.soundText = this.game.add.text(24, 96, 'Sound Meter: 0', { fontSize: '16px', fill: '#FFF' });
        //this.maxSoundText = this.game.add.text(24, 116, 'Max Meter: 0', { fontSize: '16px', fill: '#FFF' });
        //this.heightText = this.game.add.text(24, 136, 'Player.y: 0', { fontSize: '16px', fill: '#FFF' });
        //this.maxSound = 0;

        // Initialize timer starting game
        this.timer = this.game.time.create();
        this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 4, this.endTimer, this);
        this.timer.start();
        this.timerText = this.game.add.bitmapText(this.game.width/2, this.game.height/2, 'font-white', '0', 128);

        // Initialize obstacle spawning
        this.obstacles = this.game.add.group();
        this.obstacles.enableBody = true;
        this.finishEarlyObs = false;
        this.earlyObsCount = 0;

        // Initialization variable
        this.restartReady = false;
        this.isPaused = true;
        this.isJumping = false;
        this.isOnAir = false;
        this.isBaloon = false;
        this.isDeflating = false;
        this.goingBaloon = false;
        this.startingHeight = this.player.body.y;
        this.tempYVel = 0;
        this.popupOpen = false;
        this.gameStart = false;
        this.lastscoredetect = FillyFoly.globalScore;
    },

    update: function() {
        FillyFoly.speed = 300;
        FillyFoly.pixelPerMeter = 200;
        FillyFoly.BaloonHeight = 250;
        FillyFoly.BaloonTime = 1300;
        FillyFoly.obstacleNames = ['obs-box1', 'obs-box2', 'obs-pipe1', 'obs-garbage'];
        FillyFoly.coloredObs = ['obs-drum1', 'obs-drum2'];
        FillyFoly.colorNames = ['gray', 'green'];
        FillyFoly.carNames = ['car1'];
        FillyFoly.dangerousObs = ['obs-bush1', 'obs-bush2', 'obs-bush3'];
        FillyFoly.earlyObs = ['obs-bush3', 'obs-drum1-gray', 'car1'];
        if (FillyFoly.globalScore != this.lastscoredetect) {
            FillyFoly.globalScore = this.lastscoredetect;
        }

        // Collide the player with the platforms
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.collide(this.player, this.obstacles, this.playerMove);

        // Start CountDown
        if (this.timer.running && (this.timerEvent.delay - this.timer.ms) >= 1000) {
            this.timerText.text = Math.floor((this.timerEvent.delay - this.timer.ms) / 1000);
            this.timerText.anchor.set(0.5);
            this.lastSpawnTime = this.game.time.time;
        }
        else {
            if (this.timer.running) {
                this.timerText.text = "GO!!";
                // spawn object
                if (!this.gameStart) {
                    this.createObstacle();
                    this.game.time.events.loop(Phaser.Timer.SECOND * ((Math.random() * 2) + 2), this.createObstacle, this);

                    this.isPaused = false;
                    this.gameStart = true;
                }
            }
        }

        if (this.isPaused) {
            this.player.body.gravity.y = 0;
            this.obstacles.setAll('body.velocity.x', 0);
            this.tempYVel = this.player.body.velocity.y;
            this.player.body.velocity.y = 0;
        }

        else {
            // Stop player velocity
            this.player.body.velocity.x = 0;
            if (this.tempYVel != 0) {
                this.player.body.velocity.y = this.tempYVel;
                this.tempYVel = 0;
            }
            this.player.body.x = 80;
            this.player.body.gravity.y = 2000;

            // Move Background
            this.clouds.tilePosition.x -= (FillyFoly.speed - 250) * this.game.time.elapsed/1000;
            this.bg4.tilePosition.x -= (FillyFoly.speed - 230) * this.game.time.elapsed/1000;
            this.bg3.tilePosition.x -= (FillyFoly.speed - 200) * this.game.time.elapsed/1000;
            this.bg2.tilePosition.x -= (FillyFoly.speed - 160) * this.game.time.elapsed/1000;
            this.bg1.tilePosition.x -= (FillyFoly.speed - 100) * this.game.time.elapsed/1000;
            this.ground.tilePosition.x -= FillyFoly.speed * this.game.time.elapsed/1000;

            // Move Obstacle
            this.obstacles.setAll('body.velocity.x', -FillyFoly.speed);

            if (this.player.body.touching.down)
            {
                if (this.isOnAir) {
                    this.player.animations.play('drop', null, false);
                    this.player.animations.currentAnim.onComplete.add(function() {
                        this.isOnAir = false;
                        this.isBaloon = false;
                    }, this);
                } else {
                    this.player.animations.play('skate');
                }
            }
            else if (this.isJumping) {
                this.player.animations.play('jump', null, false);
                this.player.animations.currentAnim.onComplete.add(function() {
                    this.isJumping = false;
                }, this);
            }
            else if (this.isBaloon) {
                this.player.animations.play('baloon');
                this.player.body.gravity.y = 0;
                this.player.body.velocity.y = 0;
            }

            if (this.player.body.velocity.y > 250) {
                if (!this.isDeflating)
                    this.player.frame = 14;
            }

            // Debug controller without mic
            //if (this.game.input.activePointer.isDown) {
            //    FillyFoly.micMeter = 0.45 + Math.random() * 0.3;
            //}
            //else {
            //    FillyFoly.micMeter = 0;
            //}

            console.log(FillyFoly.micMeter)
            // Allow the player to jump if they are touching the ground.
            if (FillyFoly.micMeter >= 0.25) {
                if (this.player.body.touching.down) {
                    var jumpingVelocity = ((FillyFoly.micMeter - 0.25) * -2000) - 700;
                    if (jumpingVelocity < -1100)
                        jumpingVelocity = -1100;
                    this.player.body.velocity.y = jumpingVelocity;
                    this.startingHeight = this.player.body.y;
                    this.isJumping = true;
                    this.isOnAir = true;
                }
            }
            if (this.player.body.velocity.y > 0) {
                if (this.startingHeight - this.player.body.y >= FillyFoly.BaloonHeight) {
                    this.goingBaloon = true;
                    this.startingHeight = this.player.body.y;
                }
            }

            if (this.goingBaloon) {
                this.goingBaloon = false;
                this.player.animations.play('inflate', null, false);
                this.player.animations.currentAnim.onComplete.add(function() {
                    this.isBaloon = true;
                    this.startBaloonTime = this.game.time.time;
                }, this);
            }


            if (this.isBaloon) {
                if (this.game.time.time - this.startBaloonTime > FillyFoly.BaloonTime) {
                    this.player.animations.play('deflate', null, false);
                    this.isBaloon = false;
                    this.isDeflating = true;
                    this.player.animations.currentAnim.onComplete.add(function() {
                        this.isDeflating = false;
                    }, this);
                }
            }

            if (this.player.body.touching.right)
            {
                FillyFoly.gameOver = true;
            }

            if (FillyFoly.gameOver) {
                this.playerKilled();
                // sendScore(FillyFoly.globalScore);
            }

            // Score Manager
            FillyFoly.globalScore += (FillyFoly.speed/FillyFoly.pixelPerMeter) * this.game.time.elapsed/1000;
            this.lastscoredetect = FillyFoly.globalScore;
            
            // Score Text
            if (FillyFoly.globalScore >= 1000){
                this.scoreText.text = 'Score: ' + Math.floor(FillyFoly.globalScore / 1000) + ' km';
            }
            else {
                this.scoreText.text = 'Score: ' + Math.floor(FillyFoly.globalScore) + ' m';
            }
        }

        // Debug Update
        //this.soundText.text = 'Sound Meter: ' + FillyFoly.micMeter.toFixed(5);
        //if (this.maxSound < FillyFoly.micMeter)
        //    this.maxSound = FillyFoly.micMeter;
        //this.maxSoundText.text = 'Max Meter: ' + this.maxSound.toFixed(5);
        //this.heightText.text = 'Player.y: ' + (493 - this.player.body.y).toFixed(5);
    },

    // debug physics
    //render : function() {
    //  this.game.debug.body(this.player);
    //  this.game.debug.physicsGroup(this.obstacles);
    //},

    createObstacle: function() {
        if (!this.finishEarlyObs) {
            this.earlyObsCount++;
            if (this.earlyObsCount == 1) {
                var obstacle = this.obstacles.create(this.game.world.width, this.game.world.height - 70, FillyFoly.earlyObs[0]);
                obstacle.body.setSize(obstacle.body.width - 40, obstacle.body.height - 25, 20, 25);
                obstacle.health = 2;
                obstacle.scale.set(0.9);
                obstacle.body.immovable = true;
                obstacle.anchor.set(0,1);
                obstacle.checkWorldBounds = true;
                obstacle.events.onOutOfBounds.add(this.destroyObstacle, this);
            }
            else if (this.earlyObsCount == 2) {
                var obstacle = this.obstacles.create(this.game.world.width, this.game.world.height - 70, FillyFoly.earlyObs[1]);
                obstacle.scale.set(0.8);
                obstacle.body.immovable = true;
                obstacle.anchor.set(0,1);
                obstacle.checkWorldBounds = true;
                obstacle.events.onOutOfBounds.add(this.destroyObstacle, this);
            }
            else if (this.earlyObsCount == 3) {
                var carSpawn = FillyFoly.earlyObs[2];

                // upper sprite
                var obstacle = this.obstacles.create(this.game.world.width, this.game.world.height - 168, carSpawn + '-upper');
                obstacle.body.setSize(165,104,90,0);
                obstacle.body.immovable = true;
                obstacle.anchor.set(0,1);
                obstacle.checkWorldBounds = true;
                obstacle.events.onOutOfBounds.add(this.destroyObstacle, this);

                // lower sprite
                obstacle = this.obstacles.create(this.game.world.width, this.game.world.height - 70, carSpawn + '-lower');
                obstacle.body.immovable = true;
                obstacle.anchor.set(0,1);
                obstacle.checkWorldBounds = true;
                obstacle.events.onOutOfBounds.add(this.destroyObstacle, this);
            }
            else {
                this.finishEarlyObs = true;
            }
        }
        if (this.finishEarlyObs) {
            var spawnChance = Math.random();
            if (spawnChance > 0.75) {
                // spawn small obstacles (box, pipe)
                var obstacle = this.obstacles.create(this.game.world.width, this.game.world.height - 70, Phaser.ArrayUtils.getRandomItem(FillyFoly.obstacleNames));
                obstacle.scale.set(0.9);
                obstacle.body.immovable = true;
                obstacle.anchor.set(0,1);
                obstacle.checkWorldBounds = true;
                obstacle.events.onOutOfBounds.add(this.destroyObstacle, this);
            }
            else if (spawnChance > 0.4) {
                // spawn multicolor obstacles (drum)
                var obstacle = this.obstacles.create(this.game.world.width, this.game.world.height - 70, Phaser.ArrayUtils.getRandomItem(FillyFoly.coloredObs) + '-' + Phaser.ArrayUtils.getRandomItem(FillyFoly.colorNames));
                obstacle.scale.set(0.8);
                obstacle.body.immovable = true;
                obstacle.anchor.set(0,1);
                obstacle.checkWorldBounds = true;
                obstacle.events.onOutOfBounds.add(this.destroyObstacle, this);
            }
            else if (spawnChance > 0.25) {
                // spawn big obstacle (car)
                var carSpawn = Phaser.ArrayUtils.getRandomItem(FillyFoly.carNames);

                // upper sprite
                var obstacle = this.obstacles.create(this.game.world.width, this.game.world.height - 168, carSpawn + '-upper');
                obstacle.body.setSize(165,104,90,0);
                obstacle.body.immovable = true;
                obstacle.anchor.set(0,1);
                obstacle.checkWorldBounds = true;
                obstacle.events.onOutOfBounds.add(this.destroyObstacle, this);

                // lower sprite
                obstacle = this.obstacles.create(this.game.world.width, this.game.world.height - 70, carSpawn + '-lower');
                obstacle.body.immovable = true;
                obstacle.anchor.set(0,1);
                obstacle.checkWorldBounds = true;
                obstacle.events.onOutOfBounds.add(this.destroyObstacle, this);
            }
            else {
                // spawn dangerous obstacle (bushes)
                var obstacle = this.obstacles.create(this.game.world.width, this.game.world.height - 70, Phaser.ArrayUtils.getRandomItem(FillyFoly.dangerousObs));
                obstacle.body.setSize(obstacle.body.width - 40, obstacle.body.height - 25, 20, 25);
                obstacle.health = 2;
                obstacle.scale.set(0.9);
                obstacle.body.immovable = true;
                obstacle.anchor.set(0,1);
                obstacle.checkWorldBounds = true;
                obstacle.events.onOutOfBounds.add(this.destroyObstacle, this);
            }
        }
    },

    destroyObstacle: function(obstacle) {
        obstacle.destroy();
    },

    playerMove: function(player, obstacle) {
        if (obstacle.health == 2) {
            FillyFoly.gameOver = true;
        }
        player.body.x = 80;
    },

    playerKilled: function() {
        this.isPaused = true;
        this.obstacles.setAll('body.velocity.x', 0);
        this.player.body.gravity.y = 0;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.animations.stop();
        this.player.frame = 14;

        if (this.game.width > this.game.height) {
            var popupWindow = this.game.add.sprite(this.game.width/2, this.game.height/2, 'horizontal-bg-overlay');
            var width = this.game.height/popupWindow.height;
            popupWindow.scale.set(0);
            popupWindow.anchor.set(0.5);

            this.tween = this.game.add.tween(popupWindow.scale).to( { x: width * 0.7, y: width * 0.7}, 1000, Phaser.Easing.Elastic.Out, true);

            var loseText = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 300, 'Skor Kamu', { fontSize: '32px', fill: '#000' });
            loseText.anchor.set(0.5);
            
            // Score
            if (FillyFoly.globalScore >= 1000){
                var loseScore = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 220, Math.floor(FillyFoly.globalScore / 1000) + ' km', { fontSize: '76px', fill: '#4a90e2' });
            }
            else {        
                var loseScore = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 220, Math.floor(FillyFoly.globalScore) + ' m', { fontSize: '76px', fill: '#4a90e2' });
            }
            loseScore.anchor.set(0.5);

            var loseText2 = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 50, 'Ups, Game over.', { fontSize: '64px', fill: '#000' });
            loseText2.anchor.set(0.5);

            // var button1 = this.game.add.button(popupWindow.width/2 - 230, popupWindow.height/2 + 100,'button-rank', goToRank, this);
            // button1.anchor.set(0.5);

            var button2 = this.game.add.button(popupWindow.width/2, popupWindow.height/2 + 100,'button-backGame', restartGame, this);
            button2.anchor.set(.5);

            var buttonClose = this.game.add.button(popupWindow.width/2 + 580, popupWindow.height/2 - 360,'button-close', closePopUp, this);
            buttonClose.anchor.set(0.5);

            var buttonSoc1 = this.game.add.button(popupWindow.width/2 - 50, popupWindow.height/2 + 280,'button-twitter', shareTwitter, this);
            // button1.anchor.set(0.5);

            var buttonSoc2 = this.game.add.button(popupWindow.width/2 + 30, popupWindow.height/2 + 270,'button-facebook', shareFB, this);
            button2.anchor.set(0.5);
        }

        else {
            var popupWindow = this.game.add.sprite(this.game.width/2, this.game.height/2, 'vertical-bg-overlay');
            var width = this.game.width/popupWindow.width;
            popupWindow.scale.set(0);
            popupWindow.anchor.set(0.5);

            this.tween = this.game.add.tween(popupWindow.scale).to( { x: width * 0.8, y: width * 0.8}, 1000, Phaser.Easing.Elastic.Out, true);

            var loseText = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 300, 'Skor Kamu', { fontSize: '32px', fill: '#000' });
            loseText.anchor.set(0.5);
            
            // Score
            if (FillyFoly.globalScore >= 1000){
                var loseScore = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 220, Math.floor(FillyFoly.globalScore / 1000) + ' km', { fontSize: '76px', fill: '#4a90e2' });
            }
            else {        
                var loseScore = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 220, Math.floor(FillyFoly.globalScore) + ' m', { fontSize: '76px', fill: '#4a90e2' });
            }
            loseScore.anchor.set(0.5);

            var loseText2 = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 80, 'Ups, Game over.', { fontSize: '56px', fill: '#000' });
            loseText2.anchor.set(0.5);

            // var button1 = this.game.add.button(popupWindow.width/2, popupWindow.height/2 + 60,'button-rank', goToRank, this);
            // button1.anchor.set(0.5);

            var button2 = this.game.add.button(popupWindow.width/2, popupWindow.height/2 + 60,'button-backGame', restartGame, this);
            button2.anchor.set(.5);

            var buttonClose = this.game.add.button(popupWindow.width/2 + 250, popupWindow.height/2 - 380,'button-close', closePopUp, this);
            buttonClose.anchor.set(0.5);

            var buttonSoc1 = this.game.add.button(popupWindow.width/2 - 50, popupWindow.height/2 + 330,'button-twitter', shareTwitter, this);
            // button1.anchor.set(0.5);

            var buttonSoc2 = this.game.add.button(popupWindow.width/2 + 30, popupWindow.height/2 + 320,'button-facebook', shareFB, this);
            button2.anchor.set(0.5);
        }

        popupWindow.addChild(loseText);
        popupWindow.addChild(loseText2);
        popupWindow.addChild(loseScore);
        // popupWindow.addChild(button1);
        popupWindow.addChild(button2);
        popupWindow.addChild(buttonClose);
        popupWindow.addChild(buttonSoc1);
        popupWindow.addChild(buttonSoc2);

        this.popupOpen = true;
    },

    endTimer: function() {
        this.timer.stop();
        this.timerText.text = '';
    }
}

function sendScore(score){
    return;
}

function restartGame() {
    this.game.state.start("Game");
}

function closePopUp(popupWindow) {
    popupWindow.parent.destroy();
    if (!FillyFoly.gameOver)
        this.isPaused = false;
    this.popupOpen = false;
}

function goToRank() {
    return;
    window.location.href = "https://bigbabol.otesuto.com/papan-peringkat";
}

function goToProfile() {
    return;
    window.location.href = "https://bigbabol.otesuto.com/";
}

function shareFB() {
    return;

    // using fb dialog
    //FB.ui({
    //    method: 'feed',
    //    link: 'https://bigbabol.otesuto.com/',
    //}, function(response){});

    // using sharer.php
    // let uri = 'https://www.facebook.com/sharer/sharer.php?u=https://bigbabol.otesuto.com';
    // window.open(uri);
}

function tweet(message) {
    return;

    // let uri = 'https://twitter.com/intent/tweet';
    // // if both message and hashtags are to be passed
    // if(typeof(message) === 'string') {
    //     uri += '?text=' + message;
    // }
    // // open the new window
    // window.open(uri);
}

function shareTwitter() {
    tweet('Yuk, ikut main Big Babol FiliFolly Fun Screamer. Menangkan Samsung S8 %26 Drone DJI untuk skor tertinggi. Let show your scream! https://bigbabol.otesuto.com');
}

function OpenPopUpLogout() {
    if (!this.popupOpen && this.gameStart) {
        this.isPaused = true;
        this.popupOpen = true;

        if (this.game.width > this.game.height) {
            var popupWindow = this.game.add.sprite(this.game.width/2, this.game.height/2, 'horizontal-bg-overlay');
            var width = this.game.height/popupWindow.height;
            popupWindow.scale.set(0);
            popupWindow.anchor.set(0.5);

            this.tween = this.game.add.tween(popupWindow.scale).to( { x: width * 0.7, y: width * 0.7 }, 1000, Phaser.Easing.Elastic.Out, true);

            var loseText = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 80, 'Kamu yakin ingin keluar?', { fontSize: '64px', fill: '#000' });
            loseText.anchor.set(0.5);

            var loseText2 = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 80, '', { fontSize: '84px', fill: '#000' });
            loseText.anchor.set(0.5);

            // var button1 = this.game.add.button(popupWindow.width/2 - 230, popupWindow.height/2 + 100,'button-rank', () => {}, this);
            // button1.anchor.set(0.5);
``
            var button2 = this.game.add.button(popupWindow.width/2, popupWindow.height/2 + 100,'button-backGame', restartGame, this);
            button2.anchor.set(.5);

            // var buttonClose = this.game.add.button(popupWindow.width/2 + 580, popupWindow.height/2 - 360,'button-close', closePopUp, this);
            // buttonClose.anchor.set(0.5);
        }

        else {
            var popupWindow = this.game.add.sprite(this.game.width/2, this.game.height/2, 'vertical-bg-overlay');
            var width = this.game.width/popupWindow.width;
            popupWindow.scale.set(0);
            popupWindow.anchor.set(0.5);

            this.tween = this.game.add.tween(popupWindow.scale).to( { x: width * 0.8, y: width * 0.8}, 1000, Phaser.Easing.Elastic.Out, true);

            var loseText = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 170, 'Kamu yakin', { fontSize: '64px', fill: '#000' });
            loseText.anchor.set(0.5);

            var loseText2 = this.game.add.text(popupWindow.width/2, popupWindow.height/2 - 90, 'ingin keluar?', { fontSize: '64px', fill: '#000' });
            loseText2.anchor.set(0.5);

            // var button1 = this.game.add.button(popupWindow.width/2, popupWindow.height/2 + 60,'button-rank', goToRank, this);
            // button1.anchor.set(0.5);

            var button2 = this.game.add.button(popupWindow.width/2, popupWindow.height/2 + 60,'button-backGame', restartGame, this);
            button2.anchor.set(.5);

            // var buttonClose = this.game.add.button(popupWindow.width/2 + 250, popupWindow.height/2 - 380,'button-close', closePopUp, this);
            // buttonClose.anchor.set(0.5);
        }

        popupWindow.addChild(loseText);
        popupWindow.addChild(loseText2);
        // popupWindow.addChild(button1);
        popupWindow.addChild(button2);
        // popupWindow.addChild(buttonClose);
    }
}
