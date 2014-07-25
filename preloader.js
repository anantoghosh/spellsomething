
BasicGame.Preloader = function (game) {

  this.background = null;
  this.preloadBar = null;

  this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function () {

    //  Show the loading progress bar asset we loaded in boot.js
    this.stage.backgroundColor = '#2d2d2d';

    this.preloadBar = this.add.sprite(0, this.world.centerY, 'preloaderBar');
    this.preloadBar.x = this.world.centerX - this.preloadBar.width/2;

    this.add.text(this.world.centerX, this.world.centerY - 20, "Loading...", { fill: "#fff" }).anchor.setTo(0.5, 0.5);

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);

    //  Here we load the rest of the assets our game needs.
    this.load.spritesheet('blue', 'assets/blue.png', 32, 32);
    this.load.image('button', 'assets/grey_button02.png');
    this.load.audio('pop', ['sounds/pop.ogg', 'sounds/pop.wav']);
    this.load.audio('music', ['sounds/Ambler.ogg', 'sounds/Ambler.wav']);
    this.load.image('backdrop', 'assets/backdrop.jpg');
    this.load.image('blueglow','assets/blue_glow.png');
    //this.load.audio('titleMusic', ['audio/main_menu.mp3']);
    //  + lots of other required assets here

  },

  create: function () {

    //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;

  },

  update: function () {

    //  You don't actually need to do this, but I find it gives a much smoother game experience.
    //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
    //  You can jump right into the menu if you want and still play the music, but you'll have a few
    //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
    //  it's best to wait for it to decode here first, then carry on.

    //  If you don't have any music in your game then put the game.state.start line into the create function and delete
    //  the update function completely.

    if (this.cache.isSoundDecoded('music') && this.ready == false)
    {
      this.ready = true;
//      this.state.start('Game');
        this.state.start("MainMenu");
    }

  }

};
