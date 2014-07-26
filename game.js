
BasicGame.Game = function (game) {

};

/*
Hit Box Class
*/
HitBox = function (game, frame, value) {
  Phaser.Sprite.call(this, game, 0, 0, "blue", frame);
//  this.alpha = 0.7;
  var bubble = game.add.sprite(0, 0, "bubble");
  bubble.anchor.setTo(0.5, 0.5);
  bubble.tint = 0x69b9fc;
  bubble.alpha = 0.5;
  bubble.scale.setTo(1.2,1.2);
  this.addChild(bubble);

//  this.number = game.add.sprite(0, 0,'blue', frame);
//  this.number.anchor.setTo(0.5, 0.5);
//  this.number.scale.setTo(0.7,0.7);
//  this.number.alpha = 0.7;

//  this.addChild(this.number);
//  this.createContainer(game);
};

HitBox.prototype = Object.create(Phaser.Sprite.prototype);
//HitBox.prototype.update = function(game) {
//    this.bubble.x = this.x;
//    this.bubble.y = this.y;
//  };
//HitBox.prototype.createContainer = function(game) {
//  this.bubble = game.add.sprite(this.x, this.y, 'blue', 15);
////  this.bubble.anchor.setTo(0.5,0.5);
//  this.bubble.z = -100;
//};
HitBox.prototype.constructor = HitBox;
/**/

/*
New Hit Box Group Class
This Group will contain two sprites, the container bubble and forground element ('alphabets')
*/
HitBoxContainerGroup = function(game, parent) {
  Phaser.Group.call(this, game, parent);
};

HitBoxContainerGroup.prototype = Object.create(Phaser.Group.prototype);
HitBoxContainerGroup.prototype.constructor = HitBoxContainerGroup;
/**/

BasicGame.Game.prototype = {

  preload: function() {

  },

  create: function () {

    this.setUpGame();
    this.backdrop = this.add.sprite(0,0,"backdrop");
    this.backdrop.width = this.world.width;
    this.backdrop.height = this.world.height;

    //Emitter
    this.emitter = this.add.emitter(0, 0, 100);

    this.emitter.makeParticles("blueglow");
    this.emitter.gravity = 300;

//    this.input.onDown.add(this.particleBurst, this);

    //Temp nested group get alive test
//    this.first = this.add.group();
//    this.second = this.add.group();
//    this.third = this.add.group();
//    var one = this.add.sprite(20, 100, 'blue', 15);
//    one.name = "one";
//    var two = this.add.sprite(52, 100, 'blue', 14);
//    two.name = "two";
//    var three = this.add.sprite(84, 100, 'blue', 13);
//    three.name = "three";
//
//    var four = this.add.sprite(116, 100, 'blue', 12);
//    four.name = "four";
//    this.second.add(one);
//    this.second.name = "second g";
//    this.second.add(two);
//    this.third.add(three);
//    this.third.name = "third g";
//    this.third.add(four);
//    this.first.add(this.third);
//    this.first.add(this.second);
//    this.third.children[0].kill();
//    this.third.children[1].kill();
//    console.log(this.third.getFirstExists(false));
//    console.log(this.first.getFirstExists(false));
    /**/
    //hitTokens
    this.hitBoxGroup = this.add.group();

    //Colliding Side Walls
    this.wallgroup = this.add.group();
    this.wallgroup.add(this.createWall(-1, 0));
    this.wallgroup.add(this.createWall(this.world.width, 0));

    this.updateStage();

    this.popSound = this.add.audio('pop');
//    this.music = this.add.audio('music');
//    this.music.loop = true;
//    this.music.play();

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
    this.time.deltaCap = 0.02;
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

  particleBurst: function(pointer) {

    //  Position the emitter where the mouse/touch event was
    this.emitter.setRotation(0, 0);
    this.emitter.setAlpha(0.3, 0.8);
    this.emitter.setScale(0.5, 0.5);
    this.emitter.x = pointer.x;
    this.emitter.y = pointer.y;
    this.emitter.start(true, 2000, null, 10);

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
    var token_map;
    var probability = Math.floor(Math.random()*11);
    if (probability < 2 && this.answer.length !== 0) {
      token_map = this.answer[0];
//      console.log("Boosted:" + token_map);
    }
    else {
      var tokens = this.stages[this.currentStage]["tokens"][this.subStage];
      token_map = this.token_group_map[tokens][this.rnd.integerInRange(0,this.token_group_map[tokens].length-1)];
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
//    hit.frame = frame;
    hit.value = token_map;

    hit.frame = frame;
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

//    var t =this.add.tween(hit.scale).to({y: 1.8}, 200, Phaser.Easing.Linear.InOut, true, 0, 1000, true);

    this.hitBoxGroup.add(hit);
  },

  hitBoxClicked: function (item, pointer) {
    this.text = item.value;
    console.log(item.value);
    var found = this.answer.indexOf(item.value);
    if(found != -1) {
      this.answer.splice(found, 1);
      item.children[0].destroy();
      console.log("children " + item.children);
      this.popSound.play();
      this.particleBurst(item);
//      item.kill();
      item.alpha = 1;
      var tween = this.add.tween(item).to( { x: 160, y: 440}, 1000, Phaser.Easing.Cubic.Out, true).to({angle: 0}, 1000, Phaser.Easing.Elastic.Out);
      this.add.tween(item.scale).to( { x: 1, y: 1}, 1000, Phaser.Easing.Cubic.Out, true);
      tween.onComplete.add(function(){item.body.velocity.setTo(0, 0);
      item.body.angularVelocity = 0;}, item);

//      item.body.
      item.body.enablebody = false;
      this.hitBoxGroup.remove(item);
      this.world.add(item);
      console.log(item);

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
