BasicGame.StoryScreen = function (game) {

};

BasicGame.StoryScreen.prototype = {

  preload: function() {
  },

  create: function() {
    this.add.sprite(0, 0, "happy");
  },

  update: function() {
    if (this.input.activePointer.isDown) {
      this.startGame();
    }
  },

  startGame: function() {
    this.state.start('Game');
  },
}
