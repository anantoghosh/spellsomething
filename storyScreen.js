BasicGame.StoryScreen = function (game) {

};

BasicGame.StoryScreen.prototype = {

  preload: function() {
  },

  create: function() {
//    console.log(BasicGame);
//    console.log(BasicGame.Game);
//    console.log(level);
//    console.log(this.LevelManager);
    var image = level.stages[level.currentStage]["image"];
    this.currentImage = this.add.sprite(0, 0, image);
  },

  update: function() {
    if (this.input.activePointer.isDown) {
      this.startGame();
    }
  },

  startGame: function() {
    this.state.start('Game');
  },

  shutdown: function() {
    this.currentImage.destroy();
  },
}
