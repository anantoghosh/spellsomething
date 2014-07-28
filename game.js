
BasicGame.Game = function (game) {

};

/*
Hit Box Class
*/
HitBox = function (game, frame, value) {
  Phaser.Sprite.call(this, game, 0, 0, "alphabets", frame);

  this.width = 64;
  //Bubble Container Sprite as child
  var bubble = game.add.sprite(0, 0, "bubble");
  bubble.anchor.setTo(0.5, 0.5);
  bubble.tint = Math.random() * 0xffffff;
  bubble.alpha = 0.6;
  bubble.scale.setTo(1.2,1.2);
  game.add.tween(bubble.scale).to({x:1.1, y: 1.1}, 400, Phaser.Easing.Linear.None, true, 0, 1000, true);
  this.addChild(bubble);
};

HitBox.prototype = Object.create(Phaser.Sprite.prototype);
HitBox.prototype.constructor = HitBox;

HitBox.prototype.setUp = function(frame, token_map, game) {
  this.reset(32, game.rnd.integerInRange(game.world.height + 32,game.world.height + 64));
  this.value = token_map;
  this.frame = frame;
  this.enableBody = true;
  this.outOfBoundsKill = true;
  this.checkWorldBounds = true;
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.velocity.x = game.rnd.integerInRange(-250, 250);
  this.body.angularVelocity = game.rnd.integerInRange(-360, 360);
//  this.body.setSize(64, 64);
  this.body.velocity.y = game.rnd.integerInRange(-200, -100);
//  this.scale.setTo(1,);
  this.anchor.setTo(0.5, 0.5);
  this.body.bounce.set(1);
  this.inputEnabled = true;
  this.events.onInputDown.add(game.hitBoxClicked, game);
};
/**/

/*
GameUI
*/
GameUI = function (game) {
  //Button ui
//  game.bar = game.add.sprite(0, 0, "button");
//  game.bar.width = game.world.width;
//  game.bar.height = 64;
//  game.bar.tint = 0xededed;
//  game.bar.y = game.world.height - game.bar.height;
  this.poppedChars = [];
  this.menu_sprites = [];
  console.log("gameui called");
};

GameUI.prototype.destroyChars = function(game) {
  for(var i=this.poppedChars.length-1; i>=0; i--) {
    this.poppedChars[i].destroy();
    this.poppedChars.pop();
  }
};

GameUI.prototype.updateHeart = function(game) {
  this.heart = [];
  for(var i=0; i< game.health; i++) {
    this.heart[i] = game.add.sprite(game.world.width - i*24 - 12, 12, 'heart');
    this.heart[i].width = 24;
    this.heart[i].height = 24;
    this.heart[i].anchor.setTo(0.5, 0.5);
  }
};

GameUI.prototype.destroyHeart = function(game) {
  this.heart[this.heart.length - 1].destroy();
  this.heart.pop();
};

GameUI.prototype.updateUI = function(game) {
  //Remove any Previous sprites
  if(this.menu_sprites.length !== 0){
    for(var i=0; i<this.menu_sprites.length; i++) {
      this.menu_sprites[i].destroy();
    }
  }

  var frame;

  var sprite_width = 32;
  game.menu_x_pos = [];
  game.menu_x_pos[0] = (game.world.width - game.answer.length * sprite_width)/2 - 16;

  for(var ans=0; ans<game.answer.length; ans++) {

    frame = game.sprite_map[game.answer[ans]][0];
    game.menu_x_pos[ans] = game.menu_x_pos[0] + ans * sprite_width;
    this.menu_sprites[ans] = game.add.sprite(game.menu_x_pos[ans], game.world.height - 64, "alphabets", frame);
//    this.menu_sprites[ans].anchor.setTo(0.5, 0.5);
    this.menu_sprites[ans].tint = 0x555555;

  }
};
/**/

/*
Level Manager
*/
BasicGame.LevelManager = function(game) {
  this.currentStage = "stage1";
  this.subStage = 0;
};

//BasicGame.LevelManager.prototype.constructor = LevelManager;

BasicGame.LevelManager.prototype.startLevel = function(game) {
  this.timer = game.time.events.loop(Phaser.Timer.SECOND/2, game.createHitBox, game);
};

BasicGame.LevelManager.prototype.stopLevel = function(game) {
  game.time.events.remove(this.timer);
};

BasicGame.LevelManager.prototype.changeLevel = function(game) {
  if (game.answer.length === 0) {
    if (this.subStage == game.answer_map[this.currentStage]["tokens"].length - 1) {
      this.subStage = 0;
      var thisStage = + this.currentStage.match(/\d+/g)[0];
      thisStage++;

      //templogic back to stage 1
      if (thisStage == 3)
        thisStage = 1;

      this.currentStage = "stage" + thisStage;

      game.state.start('StoryScreen');
    }
    else {
      this.subStage++;
    }
    game.i = 0;
    game.updateStage();
  }
};

var level = new BasicGame.LevelManager(this);
/**/

BasicGame.Game.prototype = {

  preload: function() {

  },

  create: function() {
    this.start();
  },

  start: function () {

    this.setUpGame();
    this.backdrop = this.add.sprite(0, 0, "backdrop");
    this.backdrop.width = this.world.width;
    this.backdrop.height = this.world.height;

    //Emitter
    this.emitter = this.add.emitter(0, 0, 100);

    this.emitter.makeParticles("blueglow");
    this.emitter.gravity = 300;

    //hitTokens
    this.hitBoxGroup = this.add.group();

    //Colliding Side Walls
    this.wallgroup = this.add.group();
    this.wallgroup.add(this.createWall(-1, 0));
    this.wallgroup.add(this.createWall(this.world.width, 0));

    this.popSound = this.add.audio('pop');
//    this.music = this.add.audio('music');
//    this.music.loop = true;
//    this.music.play();

    this.gameUI = new GameUI(this);
    this.gameUI.updateHeart(this);

    this.updateStage();

    // Show FPS
    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
        10, 10, '', { fontSize: '20px', fill: '#ffffff' }
    );

    this.i = 0;
    level.startLevel(this);
  },

  setUpGame: function () {
    this.time.deltaCap = 0.02;
    this.sprite_map = {
      "a": [0],
      "b": [1],
      "c": [2],
      "d": [3],
      "e": [4],
      "f": [5],
      "g": [6],
      "h": [7],
      "i": [8],
      "j": [9],
      "k": [10],
      "l": [11],
      "m": [12],
      "n": [13],
      "o": [14],
      "p": [15],
      "q": [16],
      "r": [17],
      "s": [18],
      "t": [19],
      "u": [20],
      "v": [21],
      "w": [22],
      "x": [23],
      "y": [24],
      "z": [25],
      "zero": [26],
      "one": [27],
      "two": [28],
      "three": [29],
      "four": [30],
      "five": [31],
      "six": [32],
      "seven": [33],
      "eight": [34],
      "nine": [35],
    };

    this.token_group_map = {
      "numbers": ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
      "alphabets": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    };

    this.stages = {
      "stage1": {
        "start_text": "something something",
        "tokens": ["alphabets", "alphabets"],
        "win_text": "Your getting smarter padwan",
        "lose_text": "Boo hoo",
      },
      "stage2": {
        "start_text": "something something",
        "tokens": ["alphabets", "alphabets"],
        "win_text": "Your getting smarter padwan",
        "lose_text": "Boo hoo",
      },
    };

    this.answer_map = {
      "stage1": {
        "tokens": [["s", "p", "e", "l", "l"], ["h", "a", "p", "p", "y"]],
      },
      "stage2": {
        "tokens": [["s", "m", "a", "r", "t"], ["i", "d", "i", "o", "t"]],
      },
    };

//    this.currentStage = "stage1";
//    this.subStage = 0;
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

    //Change Required Answer with the currentStage and subStage values
    this.answer = this.answer_map[level.currentStage]["tokens"][level.subStage].slice();

    this.gameUI.updateUI(this);

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

    // 20% chance of getting a correct Hit Box
    var probability = Math.floor(Math.random()*11);
    if (probability < 2 && this.answer.length !== 0) {
      token_map = this.answer[0];
    }
    else {
      var tokens = this.stages[level.currentStage]["tokens"][level.subStage];
      token_map = this.token_group_map[tokens][this.rnd.integerInRange(0,this.token_group_map[tokens].length-1)];
    }

    var frame = this.sprite_map[token_map][0];

    var hit = this.hitBoxGroup.getFirstExists(false);

    if(!hit) {
      hit = new HitBox(this.game, frame, token_map);
    }

    hit.setUp(frame, token_map, this);

//    var t =this.add.tween(hit.scale).to({x: 1.1, y: 1.1}, 200, Phaser.Easing.Linear.InOut, true, 0, 0, true);

    this.hitBoxGroup.add(hit);
  },

  hitBoxClicked: function (item, pointer) {
    this.gameUI.poppedChars.push(item);
    this.text = item.value;
    var found = this.answer.indexOf(item.value);
    if(item.value == this.answer[0]) {
      this.answer.splice(0, 1);
      item.children[0].destroy();
      this.popSound.play();
      this.particleBurst(item);
      item.alpha = 1;
      var tween = this.add.tween(item).to(
        { x: this.menu_x_pos[this.i++]+32, y: this.world.height - 64 + 28 },
        1000,
        Phaser.Easing.Cubic.Out,
        true
      ).to(
        {angle: 0,
        x: this.menu_x_pos[this.i-1]+32, y: this.world.height - 64 + 28 },
        1000,
        Phaser.Easing.Elastic.Out
      );
      this.add.tween(item.scale).to( { x: 1, y: 1}, 1000, Phaser.Easing.Cubic.Out, true);
      tween.onComplete.add(function(){
        item.body.velocity.setTo(0, 0);
        item.body.angularVelocity = 0;
      }, item);

      item.body.enablebody = false;
      this.hitBoxGroup.remove(item);
      this.world.add(item);

      if (this.answer.length === 0) {
        this.time.events.add(Phaser.Timer.SECOND * 2,
                             function() {
                               level.changeLevel(this);
                               this.gameUI.destroyChars();
                             },
                             this);
      }
    }
    else {
      this.health--;
      this.gameUI.destroyHeart();
    }
  },

  update: function () {

    if (this.time.fps !== 0) {
        this.fpsText.setText(this.time.fps);
    }

    this.physics.arcade.collide(this.hitBoxGroup);
    this.physics.arcade.collide(this.hitBoxGroup, this.wallgroup);
  },

  render: function () {
  },

  quitGame: function (pointer) {
    this.state.start('MainMenu');

  }

};
