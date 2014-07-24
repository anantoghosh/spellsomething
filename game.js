
BasicGame.Game = function (game) {

};

HitBox = function (game, frame, value) {
  Phaser.Sprite.call(this, game, 32, game.rnd.integerInRange(game.world.height + 32,game.world.height + 64), 'blue', frame);
  this.value = value;
};

HitBox.prototype = Object.create(Phaser.Sprite.prototype);
HitBox.prototype.constructor = HitBox;

BasicGame.Game.prototype = {

  preload: function() {

  },

  create: function () {

    this.setUpGame();

    //hitTokens
    this.hitBoxGroup = this.add.group();

    //Colliding Side Walls
    this.wallgroup = this.add.group();
    this.wallgroup.add(this.createWall(-1, 0));
    this.wallgroup.add(this.createWall(this.world.width, 0));

    this.updateStage();

    this.popSound = this.add.audio('pop');
    this.music = this.add.audio('music');
    this.music.loop = true;
    this.music.play();

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


    this.game.time.events.loop(Phaser.Timer.SECOND/2, this.createHitBox, this);
  },

  setUpGame: function () {
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
        "tokens": [["one", "one", "one", "one"], ["blue", "blue", "blue"]],
      },
      "stage2": {
        "tokens": [["red", "red", "red", "red"], ["five", "five", "five"]],
      },
    };

    this.currentStage = "stage1";
    this.subStage = 0;
    this.health = 3;
  },

  updateStage: function () {
//    console.log(this.currentStage, this.subStage);
    this.answer = this.answer_map[this.currentStage]["tokens"][this.subStage].slice();
    console.log(+ this.currentStage.match(/\d+/g)[0]);
  },

  createWall: function (x, y) {
    var wall = this.add.sprite(x, y);
    wall.height = this.world.height + 64;
    wall.width = 1;
    this.physics.enable(wall, Phaser.Physics.ARCADE);
    wall.body.immovable = true;
    wall.renderable = false;
    return wall;
  },

  createHitBox: function () {
    var probability = Math.floor(Math.random()*11);
    if (probability < 2 && this.answer.length != 0) {
      var token_map = this.answer[0];
//      console.log("Boosted:" + token_map);
    }
    else {
      var tokens = this.stages[this.currentStage]["tokens"][this.subStage];
      var token_map = this.token_group_map[tokens][this.rnd.integerInRange(0,this.token_group_map[tokens].length-1)];
//      console.log("Normal:" + token_map);
    }

    var frame = this.sprite_map[token_map][this.rnd.integerInRange(0,this.sprite_map[token_map].length-1)];
    var hit = this.hitBoxGroup.getFirstExists(false);

    if(!hit) {
        hit = new HitBox(this.game, frame, token_map);
//        console.log("New" + hit);
    }
    else {
//      console.log("Reused: " + hit);
    }

    hit.reset(32, this.rnd.integerInRange(this.world.height + 32,this.world.height + 64));
    hit.frame = frame;
    hit.value = token_map;

    hit.enableBody = true;
    hit.outOfBoundsKill = true;
    hit.checkWorldBounds = true;
    this.physics.enable(hit, Phaser.Physics.ARCADE);
    hit.body.velocity.x = this.rnd.integerInRange(-250, 250);
    hit.body.angularVelocity = this.rnd.integerInRange(-360, 360);
    hit.body.setSize(32, 32);
    hit.body.velocity.y = this.rnd.integerInRange(-200, -100);
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
      item.kill();
      this.popSound.play();
      if (this.answer.length === 0) {
        console.log(this.answer_map[this.currentStage]["tokens"].length);
        if (this.subStage == this.answer_map[this.currentStage]["tokens"].length - 1) {
          this.subStage = 0;
          var thisStage = + this.currentStage.match(/\d+/g)[0];
          thisStage++;
          //templogic back to stage 1
          if (thisStage == 3) thisStage = 1;

          this.currentStage = "stage" + thisStage;
          console.log(this.currentStage);
        }
        else {
          this.subStage++;
        }
        this.updateStage();
      }
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
