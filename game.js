
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
//  bubble.tint = Math.random() * 0xffffff;
  bubble.alpha = 0.6;
  bubble.scale.setTo(1.2,1.2);
  game.add.tween(bubble.scale).to({x:1.1, y: 1.1}, 400, Phaser.Easing.Linear.None, true, 0, 1000, true);
  this.addChild(bubble);
};

HitBox.prototype = Object.create(Phaser.Sprite.prototype);
HitBox.prototype.constructor = HitBox;

HitBox.prototype.setUp = function(frame, token_map, game) {
  this.value = token_map;
  this.frame = frame;
  this.enableBody = true;
  this.outOfBoundsKill = true;
  this.checkWorldBounds = true;
  game.physics.enable(this, Phaser.Physics.ARCADE);

//  var side = Math.floor(Math.random()*3+1);
////  console.log(side);
//
//  if(side == 2) {
    this.reset(game.rnd.integerInRange(32,game.world.width-32), game.rnd.integerInRange(game.world.height + 32,game.world.height + 64));
    this.body.velocity.x = game.rnd.integerInRange(-250, 250);
//  }
//  else if (side == 1) {
//    this.reset(-28, game.rnd.integerInRange(game.world.height - 64, game.world.height));
//    this.body.velocity.x = game.rnd.integerInRange(100, 250);
//  }
//  else {
//    this.reset(game.world.width + 28, game.rnd.integerInRange(game.world.height - 64, game.world.height));
//    this.body.velocity.x = game.rnd.integerInRange(-100, -250);
//  }
  this.body.angularVelocity = game.rnd.integerInRange(-250, 250);
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
  this.heart = [];
//  console.log("gameui called");
};

GameUI.prototype.destroyChars = function(game) {
  for(var i=this.poppedChars.length-1; i>=0; i--) {
    this.poppedChars[i].destroy();
    this.poppedChars.pop();
  }
};

GameUI.prototype.updateHeart = function(game) {
  //Remove any Previous sprites
  if(this.heart.length !== 0){
    for(var i=0; i<this.heart.length; i++) {
      this.heart[i].destroy();
    }
  }

  for(var i=0; i< game.health; i++) {
    this.heart[i] = game.add.sprite(game.world.width - i*32 - 16, 16, 'heart');
//    this.heart[i].width = 24;
//    this.heart[i].height = 24;
    this.heart[i].scale.setTo(0.5, 0.5);
    this.heart[i].anchor.setTo(0.5, 0.5);
    this.heart[i].angle = game.rnd.integerInRange(-10, 10);
    var tween = game.add.tween(this.heart[i].scale).to({x: 0.4, y:0.4}, 100, Phaser.Easing.Elastic.InOut, true, 500 * i + 500).to({x: 0.5, y:0.5}, 50, Phaser.Easing.Elastic.InOut, true, 0).loop();
//    tween.loop();
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

    frame = level.sprite_map[game.answer[ans]][0];
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
  console.log("Level Manager");
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
        "tokens": ["alphabets", "alphabets", "alphabets", "alphabets", "alphabets", "alphabets"],
        "win_text": "Your getting smarter padwan",
        "lose_text": "Boo hoo",
        "image": "happy",
      },
      "stage2": {
        "start_text": "something something",
        "tokens": ["alphabets", "alphabets", "alphabets", "alphabets"],
        "win_text": "Your getting smarter padwan",
        "lose_text": "Boo hoo",
        "image": "fish",
      },
    };

    this.answer_map = {
      "stage1": {
        "tokens": [["a", "c", "a", "d", "e", "m", "y"], ["a", "c", "c", "e", "s", "s", "i", "b", "l", "e"], ["a", "c", "c", "i", "d", "e", "n", "t"], ["b", "e", "i", "g", "e"], ["b", "e", "l", "i", "e", "f"], ["c", "o", "l", "o", "g", "n", "e"], ["c", "o", "l", "o", "n", "e", "l"], ["c", "o", "l", "u", "m", "n"], ["d", "o", "u", "b", "l", "y"], ["d", "o", "u", "b", "t"], ["d", "r", "o", "p", "p", "e", "d"], ["e", "l", "e", "g", "a", "n", "t"], ["e", "l", "e", "m", "e", "n", "t"], ["f", "a", "s", "t", "e", "n"], ["f", "a", "t", "i", "g", "u", "e"], ["f", "e", "a", "s", "i", "b", "l", "e"], ["g", "o", "v", "e", "r", "n"], ["g", "o", "v", "e", "r", "n", "o", "r"], ["g", "r", "a", "m", "m", "a", "r"], ["h", "i", "p", "s", "t", "e", "r"], ["h", "o", "a", "x"], ["i", "n", "d", "u", "s", "t", "r", "y"], ["i", "n", "t", "e", "l"], ["i", "n", "t", "e", "r", "f", "e", "r", "e"], ["j", "e", "w", "e", "l", "r", "y"], ["j", "i", "g", "s", "a", "w"], ["j", "i", "n", "x", "e", "d"], ["k", "i", "o", "s", "k"], ["k", "n", "o", "w", "l", "e", "d", "g", "e"], ["k", "e", "r", "p", "l", "u", "n", "k"], ["l", "i", "a", "i", "s", "o", "n"], ["l", "i", "c", "e", "n", "s", "e"], ["l", "i", "c", "h", "e", "e"], ["m", "i", "s", "s", "p", "e", "l", "l"], ["m", "o", "n", "o", "g", "a", "m", "y"], ["s", "y", "l", "l", "a", "b", "l", "e"], ["n", "e", "c", "e", "s", "s", "a", "r", "y"], ["n", "e", "c", "k", "t", "i", "e"], ["n", "e", "g", "a", "t", "i", "v", "e"], ["o", "c", "c", "u", "r"], ["o", "c", "t", "o", "p", "u", "s"], ["o", "m", "i", "t", "t", "e", "d"], ["p", "r", "i", "o", "r", "i", "t", "y"], ["p", "r", "i", "v", "i", "l", "e", "g", "e"], ["p", "r", "o", "f", "a", "n", "i", "t", "y"], ["q", "u", "e", "u", "e"], ["q", "u", "i", "c", "k", "i", "e"], ["q", "u", "i", "e", "s", "c", "e", "n", "t"], ["r", "e", "p", "l", "e", "t", "e"], ["r", "e", "p", "e", "a", "t"], ["s", "e", "v", "e", "r", "a", "n", "c", "e"], ["s", "e", "w", "e", "r"], ["s", "k", "e", "p", "t", "i", "c", "a", "l"], ["t", "e", "m", "p", "o", "r", "a", "r", "y"], ["t", "e", "n", "t", "a", "t", "i", "v", "e"], ["t", "e", "r", "r", "a", "i", "n"], ["o", "r", "t", "h", "o", "d", "o", "x"], ["p", "a", "r", "a", "l", "l", "e", "l"], ["u", "p", "b", "e", "a", "t"], ["v", "a", "p", "o", "r", "i", "z", "e"], ["v", "a", "s", "e", "c", "t", "o", "m", "y"], ["w", "r", "e", "s", "t", "l", "e"], ["w", "r", "e", "t", "c", "h", "e", "d"], ["w", "r", "i", "n", "g", "i", "n", "g"], ["x", "e", "r", "o", "x"], ["x", "e", "n", "o", "n"], ["x", "y", "l", "e", "m"], ["y", "a", "c", "h", "t"], ["y", "a", "k"], ["y", "a", "r", "m", "u", "l", "k", "e"], ["z", "a", "p", "p", "e", "d"], ["z", "e", "a", "l", "o", "t"], ["z", "e", "a", "l", "o", "u", "s"]],
      },
      "stage2": {
        "tokens": [["f", "i", "s", "h"], ["a", "r", "e"], ["c", "o", "l", "d"], ["b", "l", "o", "o", "d", "e", "d"]],
      },
    };
    this.subStage = Math.floor(Math.random() * this.answer_map.stage1.tokens.length-1);
};

//BasicGame.LevelManager.prototype.constructor = LevelManager;

BasicGame.LevelManager.prototype.startLevel = function(game) {
//  this.timer = game.time.events.loop(Phaser.Timer.SECOND/2, game.createHitBox, game);
  if(game.counter % 30 == 0) {
    game.createHitBox();
    game.counter = 0;
  }
};

BasicGame.LevelManager.prototype.stopLevel = function(game) {
  game.time.events.remove(this.timer);
};

BasicGame.LevelManager.prototype.changeLevel = function(game) {
  if (game.answer.length === 0) {
    if (this.subStage == level.answer_map[this.currentStage]["tokens"].length - 1) {
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
      this.subStage = this.subStage = Math.floor(Math.random() * this.answer_map.stage1.tokens.length-1);
      game.start();
    }

  }
};

var level = new BasicGame.LevelManager(this);
/**/

BasicGame.Game.prototype = {

  preload: function() {

  },

  create: function() {
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
    this.wallgroup.add(this.createWall(-1, 0), "left");
    this.wallgroup.add(this.createWall(this.world.width, 0), "right");

    this.popSound = this.add.audio('pop');
    this.correctSound = this.add.audio('correct');
    this.music = this.add.audio('music');
    this.music.loop = true;
    this.music.play();

    this.gameUI = new GameUI(this);

    // Show FPS
    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
        10, 10, '', { fontSize: '20px', fill: '#ffffff' }
    );

    this.time.deltaCap = 0.02;

    this.start();
  },

  reset: function() {
//    this.hitBoxGroup.destroy(true);
//    this.hitBoxGroup = this.add.group();
    this.hitBoxGroup.forEachExists(function(item){item.kill();}, this)
    this.gameover = false;
    this.game.paused = false;
    this.gameUI.destroyChars();
    this.backdrop.tint = 0xffffff;
    if(this.gameOverScreen)
      this.gameOverScreen.destroy();
    this.music.play();
  },

  start: function () {

    this.health = 3;
    this.counter = 0;

    this.answer = level.answer_map[level.currentStage]["tokens"][level.subStage].slice();

    this.gameUI.updateHeart(this);
    this.gameUI.updateUI(this);


    this.i = 0;
//    level.startLevel(this);
  },

  particleBurst: function(pointer, tint) {

    //  Position the emitter where the mouse/touch event was
    this.emitter.setRotation(0, 0);
    this.emitter.setAlpha(0.3, 0.8);
    this.emitter.setScale(0.5, 0.5);
    this.emitter.x = pointer.x;
    this.emitter.y = pointer.y;
    this.emitter.start(true, 2000, null, 10);

  },


  createWall: function (x, y, side) {
    var wall = this.add.sprite(x, y);
    wall.height = this.world.height + 64;
    wall.width = 1;
    this.physics.enable(wall, Phaser.Physics.ARCADE);
    wall.body.immovable = true;
//    if (side == "left")
//      wall.body.checkCollision.left = false;
//    else if (side == "right")
//      wall.body.checkCollision.right = false;
    wall.renderable = false;
    return wall;
  },

  createHitBox: function () {
    var token_map;

    // 20% chance of getting a correct Hit Box
    var probability = Math.floor(Math.random()*11);
    if (probability < 4 && this.answer.length !== 0) {
      token_map = this.answer[0];
    }
    else {
//      var tokens = level.stages[level.currentStage]["tokens"][level.subStage];
      var tokens = "alphabets";
      token_map = level.token_group_map[tokens][this.rnd.integerInRange(0,level.token_group_map[tokens].length-1)];
    }

    var frame = level.sprite_map[token_map][0];

    var hit = this.hitBoxGroup.getFirstExists(false);

    if(!hit) {
      hit = new HitBox(this.game, frame, token_map);
      console.log("NEW CREATED " + hit);
    }

    hit.setUp(frame, token_map, this);

//    var t =this.add.tween(hit.scale).to({x: 1.1, y: 1.1}, 200, Phaser.Easing.Linear.InOut, true, 0, 0, true);

    this.hitBoxGroup.add(hit);
  },

  hitBoxClicked: function (item, pointer) {
    this.hitBoxGroup.remove(item);
    this.world.add(item);
    this.gameUI.poppedChars.push(item);
    this.text = item.value;
    var found = this.answer.indexOf(item.value);
    item.children[0].kill();
    this.popSound.play();
    this.particleBurst(item);
    item.alpha = 1;
    item.body.enablebody = false;
    if(item.value == this.answer[0]) {
      this.answer.splice(0, 1);
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
      tween.onComplete.add(function(item){
        item.body.velocity.setTo(0, 0);
        item.body.angularVelocity = 0;
        this.correctSound.play();
      }, this);

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
      item.body.gravity.y = 1500;
      item.body.velocity.x = Math.floor((Math.random()*2)-1)?-500:500;
      item.body.velocity.y = -600;
      item.outOfBoundsKill = true;
      item.checkWorldBounds = true;
//      this.time.events.add(Phaser.Timer.SECOND * 2,
//                             function() {
//                               item.kill();
////                               console.log("item " + item);
//                             },
//                             this);
      this.gameUI.destroyHeart();
      this.health--;
      if (this.health == 0) {
        this.gameOver();
      }
    }
  },

  update: function () {

    if (this.time.fps !== 0) {
        this.fpsText.setText(this.time.fps);
    }

    this.physics.arcade.collide(this.hitBoxGroup);
    this.physics.arcade.collide(this.hitBoxGroup, this.wallgroup);

    level.startLevel(this);
    this.counter++;
//    console.log(this.counter);
  },

  render: function () {
  },

  quitGame: function (pointer) {
    this.state.start('MainMenu');

  },

  gameOver: function() {
    this.gameover = true;
    this.gameOverScreen = this.add.sprite(10, this.world.height/2 - 100, "gameover");
    this.gameOverScreen.width = this.world.width - 20;
    this.gameOverScreen.height = this.gameOverScreen.width / 2.2;
    this.backdrop.tint = 0x333333;
    this.music.stop();
    this.game.paused = true;
    this.input.onDown.add(function(){
      if(this.gameover == true) {
        this.reset();
        this.start();
      }
    }, this);

  },

  shutdown: function() {
//    if(this.music)
    if(this.gameOverScreen)
    this.gameOverScreen.destroy();
//    if(this.wallgroup)
    this.wallgroup.destroy(true, false);
    this.answer = null;
    this.backdrop.destroy();
    this.correctSound.destroy();
    this.emitter.destroy();
    this.fpsText.destroy();
    this.hitBoxGroup.destroy(true, false);
    this.popSound.destroy();
    this.music.destroy();
    this.gameUI.destroyChars();
    console.log("destroyed");
  },

};
