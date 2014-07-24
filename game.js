
BasicGame.Game = function (game) {

};

HitBox = function (game, frame, value) {
  Phaser.Sprite.call(this, game, game.rnd.integerInRange(32, game.width-32), game.rnd.integerInRange(-64,-32), 'blue', frame);
  this.value = value;
};

HitBox.prototype = Object.create(Phaser.Sprite.prototype);
HitBox.prototype.constructor = HitBox;

BasicGame.Game.prototype = {

  preload: function() {
    this.load.spritesheet('blue', 'assets/blue.png', 32, 32);
    this.load.image('button', 'assets/grey_button02.png');
  },

  create: function () {

    //health
    this.health = 3;

    this.hitBoxGroup = this.add.group();

    this.wallgroup = this.add.group();
    var wall_left = this.add.sprite(-1,-64);
    wall_left.height = this.world.height + 64;
    wall_left.width = 1;

    this.physics.enable(wall_left, Phaser.Physics.ARCADE);
    wall_left.body.immovable = true;
    wall_left.renderable = false;

    this.wallgroup.add(wall_left);

    var wall_right = this.add.sprite(this.world.width,-64);
    wall_right.height = this.world.height + 64;
    wall_right.width = 1;

    this.physics.enable(wall_right, Phaser.Physics.ARCADE);
    wall_right.body.immovable = true;
    wall_right.renderable = false;

    this.wallgroup.add(wall_right);

    this.sprite_map = {
      "zero": [0],
      "one": [1],
      "two": [2],
      "three": [3],
      "four": [4],
      "five": [5],
      "six": [6],
      "seven": [7],
      "eight": [8],
      "nine": [9],
      "blue": [10],
      "red": [11]
    };

    this.token_group_map = {
      "numbers": ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
      "colors": ["blue", "red"],
    };

    this.stages = {
      "stage1": {
        "start_text": "something something",
        "tokens": ["numbers", "colors"],
        "win_text": "Your getting smarter padwan",
        "lose_text": "Boo hoo",
      },
      "stage2": {
        "start_text": "something something",
        "tokens": ["colors", "numbers"],
        "win_text": "Your getting smarter padwan",
        "lose_text": "Boo hoo",
      },
    };

    this.answer_map = {
      "stage1": {
        "tokens": [["one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one", "one"], ["blue", "blue", "blue"]],
      },
      "stage2": {
        "tokens": [["red", "red", "red", "red"], ["one", "two", "three"]],
      },
    };

    this.currentStage = "stage1";
    this.subStage = 0;

    this.updateStage();
    //Button ui
    this.bar = this.add.sprite(0, 0, "button");
    this.bar.width = this.world.width;
    this.bar.height = 64;
    this.bar.tint = 0xededed;
    this.bar.y = this.world.height - this.bar.height;

    this.barText = this.game.add.text(10, this.world.height - 32,'', {fill: '#222222'});

    // Show FPS
    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
        10, 10, '', { fontSize: '20px', fill: '#ffffff' }
    );


    this.game.time.events.loop(Phaser.Timer.SECOND/3, this.createHitBox, this);
  },

  updateStage: function () {
    this.answer = this.answer_map[this.currentStage]["tokens"][this.subStage];
    console.log(this.answer);
  },

  createHitBox: function () {
//    var json = JSON.parse(this.answer_map);
//    var value = this.game.rnd.integerInRange(0, 10);
//    var value = this.answser_map[0][this.game.rnd.integerInRange(0, 0)];
    var probability = Math.floor(Math.random()*11);
    if (probability < 2 && this.answer.length != 0) {
      var token_map = this.answer[0];
      console.log("Boosted:" + token_map);
    }
    else {
      var tokens = this.stages[this.currentStage]["tokens"][this.subStage];
      var token_map = this.token_group_map[tokens][this.rnd.integerInRange(0,this.token_group_map[tokens].length-1)];
      console.log("Normal:" + token_map);
    }

    var frame = this.sprite_map[token_map][this.rnd.integerInRange(0,this.sprite_map[token_map].length-1)];
    var hit = this.hitBoxGroup.getFirstExists(false);

    if(!hit) {
        hit = new HitBox(this.game, frame, token_map);
        console.log("New" + hit);
    }
    else {
      console.log("Reused: " + hit);
    }

    hit.reset(this.rnd.integerInRange(32, this.world.width-32), -32);
    hit.frame = frame;
    hit.value = token_map;

    hit.enableBody = true;
    hit.outOfBoundsKill = true;
    hit.checkWorldBounds = true;
    this.physics.enable(hit, Phaser.Physics.ARCADE);
    hit.body.velocity.x = this.rnd.integerInRange(-250, 250);
    hit.body.angularVelocity = this.rnd.integerInRange(-360, 360);
    hit.body.setSize(28, 28);
    hit.body.velocity.y = 300;
    hit.scale.setTo(2,2);
    hit.anchor.setTo(0.5, 0.5);
    hit.body.bounce.set(0.9);
    hit.inputEnabled = true;
    hit.events.onInputDown.add(this.hitBoxClicked, this);
    this.hitBoxGroup.add(hit);
  },

  hitBoxClicked: function (item, pointer) {
    this.text = item.value;
    console.log(item.value);
    var found = this.answer.indexOf(item.value);
    if(found != -1) {
      this.answer.splice(found, 1);
      item.destroy();
    }
    else {
      this.health--;
    }
  },

  update: function () {

    if (this.time.fps !== 0) {
        this.fpsText.setText(this.time.fps);
    }

    this.barText.setText(this.answer[0] + " x" + this.answer.length + "    life: " + this.health);
    this.physics.arcade.collide(this.hitBoxGroup);
    this.physics.arcade.collide(this.hitBoxGroup, this.wallgroup);
  },

  render: function () {
//    this.game.debug.text(this.text, 40,10);
//    this.game.debug.body( this.hitBoxGroup.getAt(1) );
  },

  quitGame: function (pointer) {
    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  }

};
