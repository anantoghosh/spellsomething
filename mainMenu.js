
BasicGame.MainMenu = function (game) {

  this.music = null;
  this.playButton = null;

};

BasicGame.MainMenu.prototype = {

  create: function () {

    //  We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //  Here all we're doing is playing some music and adding a picture and button
    //  Naturally I expect you to do something significantly better :)

    this.backdrop = this.add.sprite(0, 0, "backdrop");
    this.backdrop.alpha = 0;
    this.add.tween(this.backdrop).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 2000);

    this.title = this.add.sprite(this.world.centerX, 75, "title");
    this.title.anchor.setTo(0.5, 0.5);
    this.add.tween(this.title).from({y: -100}, 1000, Phaser.Easing.Bounce.Out, true, 0);

    this.playButton = this.add.sprite(this.world.centerX, this.world.centerY + 50, "play");
    this.playButton.anchor.setTo(0.5, 0.5);
    var tween = this.add.tween(this.playButton).from({y: this.world.height + 100}, 1500, Phaser.Easing.Elastic.Out, true, 1000);
    this.playButton.inputEnabled = true;
    this.playButton.input.useHandCursor = true;
    this.playButton.events.onInputDown.add(this.startGame, this);

//    this.levelButtons = this.add.group();
//    for(var i=0; i<5; i++) {
//      this.levelButtons.create(this.world.centerX, this.world.centerY * i + 50);
//      this.levelButton.anchor.setTo(0.5, 0.5);
//    }
//    this.levelButton = this.add.sprite(this.world.centerX, this.world.centerY + 50, 'button');
//
//    this.levelScreen = this.add.tween(this.levelButton).from({x: this.world.width + 128}, 500, Phaser.Easing.Back.Out, true, 500);
//    this.levelScreen.pause();
//    this.tween.pause();
    this.mainMusic = this.add.audio("mainmusic");
    this.mainMusic.loop = true;

    tween.onComplete.add(function() {
      this.mainMusic.play();
    },this);
//    this.alphabets = [];
//    for(var i=0; i<5; i++) {
//      this.alphabets[i] = this.add.sprite(32 * i + 32, this.world.centerY - 100, "alphabets", this.rnd.integerInRange(0, 25));
//      this.add.tween(this.alphabets[i]).from({x: -60, y: this.world.height + 50}, 1500, Phaser.Easing.Circular.Out, true, 2000);
//    }
//    this.alphabet = this.add.sprite(64, this.world.centerY - 100, "alphabets", 0);
//    this.add.tween(this.alphabet).from({y: this.world.height + 50}, 5000, Phaser.Easing.Linear.Out, true, 3000).to({y:-20}, 2000, Phaser.Easing.Linear.InOut, true, 0, 1000, true);
  },

  changeToLevelScreen: function() {
    this.add.tween(this.playButton).to({x: -64}, 500, Phaser.Easing.Back.In, true, 0);
    this.levelScreen.resume();
  },

  update: function () {

  },

  startGame: function (pointer) {

    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    // this.music.stop();

    //  And start the actual game
    this.state.start('StoryScreen');

  },

  shutdown: function() {
    this.playButton.destroy();
    this.title.destroy();
    this.backdrop.destroy();
    this.mainMusic.destroy();
  },

};
