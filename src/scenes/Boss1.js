/*global Phaser*/
export default class Boss1 extends Phaser.Scene {
  constructor () {
    super('Boss1');
  }

  init (data) {
    // Load the health score
    this.gameHealth = data.health;
    //this.gameHealth = 0;
    this.waitASecond = false;
    this.startTime = Date.now();
    //for double jumping
    this.bootsObtained = true;
    this.shieldObtained = true;
    this.jumpCount = 2;
    this.mobile = true;
    this.spriteValue = 8;
    this.bossHealth = data.lives;
    this.speed = 1 + (0.5*(3-data.lives));
  }//END OF DATA INITIALIZATION

  // Preload assets
  preload () {
    //the player's spritesheet
    this.load.spritesheet('peggy', "./assets/spritesheets/combinedSpritesheet.png", {
      frameHeight: 32,
      frameWidth: 32
    });

    // Load the health spriteSheet
    this.load.spritesheet('health', "./assets/spritesheets/healthSpriteSheet.png", {
      frameHeight: 48,
      frameWidth: 16
    });

    //Boss sprite (maybe create sprite sheet for him to give him a
    // some life with animations)
    this.load.image('boss', './assets/Boss1/bossPirate3.png');

    //background
    this.load.image('background', './assets/Boss1/bossBackground.png');

    //other game objects
    this.load.image('shine', './assets/sprites/shine.png');
    this.load.image('bullet', './assets/sprites/bulletSmall.png');
    this.load.image('cannon', './assets/sprites/cannon.png');
    this.load.image("enemy", "./assets/gameWorld/enemyPirate.png");
    this.load.image('heart', './assets/sprites/heart.png');
    this.load.image('text1', './assets/sprites/speechbubble1.png');
    this.load.image('text2', './assets/sprites/speechbubble2.png');
    this.load.image('text3', './assets/sprites/speechbubble3.png');

    //Load tilemap and tileset
    this.load.image('tiles', './assets/Boss1/shipAndBeachTiles.png');
    this.load.tilemapTiledJSON('Boss Room Platforms', './assets/Boss1/bossRoom1.json');

    // Load the gun/jump sound effect
    this.load.audio('gunAudio', './assets/audio/477346__mattiagiovanetti__some-laser-gun-shots-iii.mp3');
    this.load.audio('jumpAudio', './assets/audio/277219__thedweebman__8-bit-jump-2.mp3');
    this.load.audio('gameAudio', './assets/audio/JonECopeLoop1.mp3');
    this.load.audio('screamAudio', './assets/audio/Wilhelm_Scream_wikipedia(public).ogg');
    this.load.audio('peggyScream', './assets/audio/peggyScream.mp3');


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    var bullets;
  }//END OF PRELOAD FUNCTION

  //Create the scene
  create (data) {
    //load level background first, everything built on top of it
    var background = this.add.image(800/2, 600/2, "background");

    // initialize audio effects
    this.gameMusic = this.sound.add('gameAudio');
    this.gameMusic.volume = 0.1;
    this.gunSound = this.sound.add('gunAudio');
    this.jumpSound = this.sound.add('jumpAudio');
    this.jumpSound.volume = 0.05;
    this.screamSound = this.sound.add('screamAudio');
    this.peggyScream = this.sound.add('peggyScream');

    //speed up the music
    this.gameMusic.setRate(1.5);
    this.gameMusic.setLoop(true);
    this.gameMusic.play();


    //Create player character
    this.player = this.physics.add.sprite(400, 550, 'peggy', [this.spriteValue]);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);

    //create world bounds
    this.physics.world.setBounds(0, 0, 800, 600);

    //create level camera
    this.cameras.main.setBounds(0, 0, 800, 600);
    this.cameras.main.startFollow(this.player);


    //create level layout
    const map = this.make.tilemap({ key: 'Boss Room Platforms' });
    var tilesetz = map.addTilesetImage('shipAndBeachTiles', 'tiles');
    const platformz = map.createStaticLayer('Boss Room Platforms', tilesetz, 0, 0);
    platformz.setCollisionByExclusion(-1, true);

    //player can stand on the platforms
    this.physics.add.collider(this.player, platformz);

    //add Boss character to level
    this.boss = this.physics.add.sprite(300, 96, 'boss');
    this.boss.setScale(2)
              .flipX = false;

    this.physics.add.collider(this.boss, platformz);
    this.heart1 = this.add.sprite(280, 56, 'heart');
    this.heart2 = this.add.sprite(300, 56, 'heart');
    this.heart3 = this.add.sprite(320, 56, 'heart');

    //add his cannons
    this.cannon1 = this.physics.add.sprite(64, 64, 'cannon');
    this.cannon1.setScale(2);
    this.cannon1.flipX = true;
    this.cannon2 = this.physics.add.sprite(736, 64, 'cannon');
    this.cannon2.setScale(2);
    this.physics.add.collider(this.cannon1, platformz);
    this.physics.add.collider(this.cannon2, platformz);

    this.text1 = this.add.sprite(550, 50, 'text1');
    this.text2 = this.add.sprite(550, 50, 'text2');
    this.text3 = this.add.sprite(550, 50, 'text3');
    this.text1.setScale(0.5);
    this.text2.setScale(0.5);
    this.text3.setScale(0.5);

    //adding smaller enemies
    this.enemyGroup = this.physics.add.group({});

    this.enemy1 = this.physics.add.sprite(300, 550, 'enemy');
    this.enemyGroup.add(this.enemy1);
    this.enemy2 = this.physics.add.sprite(690, 518, 'enemy');
    this.enemyGroup.add(this.enemy2);
    this.enemy3 = this.physics.add.sprite(626, 262, 'enemy');
    this.enemyGroup.add(this.enemy3);

    this.enemyGroup.children.iterate(function(child){
      child.setScale(3.5);
      child.setCollideWorldBounds(true);
    });

    this.physics.add.collider(this.enemyGroup, platformz);

    //this.enemyGroup.add(this.boss);

    this.nextFire = 0;
    this.fireRate = 200;

    //add player's bullet group
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });
    this.physics.add.collider(this.bullets, platformz, this.hitWall, null, this);
    //add enemy's bullet group
    this.enemyBullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 100
    });

  //text
this.tweens.add({
  targets: this.text1,
  ease: "Linear",
  alpha: 0,
  delay: 3000,
  duration:10
});
this.tweens.add({
  targets: this.text2,
  ease: "Linear",
  alpha: 0,
  delay: 3000,
  duration:10
});
this.tweens.add({
  targets: this.text3,
  ease: "Linear",
  alpha: 0,
  delay: 3000,
  duration:10
});

//cannon1 and cannon2- doesn't move but shoots targeted bullets for player to dodge
this.tweens.add({
  targets: this.cannon1,
  ease: "Linear",
  x: '-=0',
  delay: 1000,
  duration: 3000/this.speed,
  yoyo: true,
  repeat: -1,
  onRepeat: function(){this.enemyShootTargeted(this.cannon1, this.enemyBullets, this.player)},
 onRepeatScope: this
});
this.tweens.add({
  targets: this.cannon2,
  ease: "Linear",
  x: '-=0',
  delay: 1000,
  duration: 3000/this.speed,
  yoyo: true,
  repeat: -1,
  onRepeat: function(){this.enemyShootTargeted(this.cannon2, this.enemyBullets, this.player)},
 onRepeatScope: this
});
// pirate boss Movement
this.tweens.add({
  targets: this.boss,
  x: '+=220',
  ease: "Linear",
  delay: 3000,
  duration: 3000,
  yoyo: true,
  repeat: -1,
  flipX: true
});
//hearts move w boss
this.tweens.add({
  targets: this.heart1,
  x: '+=220',
  ease: "Linear",
  delay: 3000,
  duration: 3000,
  yoyo: true,
  repeat: -1,
  flipX: true
});
this.tweens.add({
  targets: this.heart2,
  x: '+=220',
  ease: "Linear",
  delay: 3000,
  duration: 3000,
  yoyo: true,
  repeat: -1,
  flipX: true
});
this.tweens.add({
  targets: this.heart3,
  x: '+=220',
  ease: "Linear",
  delay: 3000,
  duration: 3000,
  yoyo: true,
  repeat: -1,
  flipX: true
});
//now tweens for the lil guys movements
this.tweens.add({
  targets: this.enemy1,
  x: '-=180',
  ease: "Linear",
  delay: 1000,
  duration: 3000/this.speed,
  yoyo: true,
  repeat: -1,
  flipX: true
});
this.add.tween({
  targets: this.enemy2,
  x: '-=180',
  ease: "Linear",
  delay: 2000,
  duration: 2000/this.speed,
  yoyo: true,
  repeat: -1,
  flipX: true,
  onRepeat: function(){this.enemyShoot(this.enemy2, this.enemyBullets, this.player)},
 onRepeatScope: this
});
this.add.tween({
  targets: this.enemy3,
  x: '-=384',
  ease: "Linear",
  delay: 2000,
  duration: 2000/this.speed,
  yoyo: true,
  repeat: -1,
  flipX: true,
  onRepeat: function(){this.enemyShoot(this.enemy3, this.enemyBullets, this.player)},
 onRepeatScope: this
});


//if player touches enemy
this.enemyGroup.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap( //if enemyGroup touches player, calls function
            b,
            this.player,
            this.healthHurt,
            null,
            this
          );
        }
      }.bind(this) //binds to each children
    );


    //HERE ARE PEGGY'S ANIMATIONS
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers('peggy', {start: this.spriteValue + 1, end: this.spriteValue + 5}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers('peggy', {start:this.spriteValue, end:this.spriteValue}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "hurt",
      frames: this.anims.generateFrameNumbers('peggy', {start:this.spriteValue + 6, end:this.spriteValue + 7}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "dash",
      frames: this.anims.generateFrameNumbers('peggy', {start:this.spriteValue + 3, end: this.spriteValue + 3}),
      framerate: 60,
      repeat: -1
    });

    // Display the health bar based on health score
    this.healthbar = this.physics.add.sprite(this.cameras.main.x+20, this.cameras.main.y+58, "health", [this.gameHealth])
    //this.healthbar.frame = this.gameHealth
    this.healthbar.setScale(2);
    this.healthbar.body.setAllowGravity(false);


    this.anims.create({
      key: "healthActive",
      frames: this.anims.generateFrameNumbers("health", {start: this.gameHealth, end: this.gameHealth}),
      frameRate: 0,
      repeat: 1
    });
  }//END OF CREATE FUNCTION

  // Update the scene
  update (time, delta) {
    this.text2.visible = false;
    this.text3.visible = false;

    if(this.bossHealth == 2){this.heart1.visible = false; this.text2.visible = true; this.text1.visible = false;}
    if(this.bossHealth == 1){this.heart1.visible = false; this.heart2.visible = false; this.text3.visible = true; this.text1.visible = false;}

    //all player input buttons
    var movement = this.input.keyboard.addKeys('A, S, D');
    var jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    var specialButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    var bang = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    var speed = 140;

    //keep track of time after being hit
    if (this.waitASecond){
      // Wait half of a second before taking another damage
      if (Date.now() >= this.startTime + 900) {
        this.waitASecond = false;
      }
    }


    //Player Input Functions
    //if player is on ground, reset jump jumpCount to 2
    //and reset player's mobility
    if (this.player.body.onFloor() && this.waitASecond == false){
        this.jumpCount = 2;
        this.mobile = true;
    }
    if (this.peggyScream.isPlaying){
      this.player.body.setVelocityX(0);
      this.player.body.setVelocityY(0);
      this.player.body.acceleration.x = 0
      this.player.anims.play('hurt', true);
    }
    // Move Left
    else if (movement.A.isDown && this.mobile == true){
      if (this.bootsObtained == true){
        if (Phaser.Input.Keyboard.JustDown(specialButton)){
          this.mobile = false;
          this.player.body.setAllowGravity(false);
          this.player.setVelocityY(0);
          this.player.body.maxVelocity.x = 768;
          this.player.setVelocityX(-768);
          this.player.anims.play('dash', true);
          this.time.delayedCall(250,this.dashFinish, null, this );
        }
      else{
        if (this.player.body.velocity.x > -speed){
          this.player.setVelocityX(-speed);
          }
        this.player.flipX = true;
        this.player.body.acceleration.x = -50;
        this.player.body.maxVelocity.x = 210;
        this.player.anims.play('walk', true);
      }
    }
    else{
      if (this.player.body.velocity.x > -speed){
        this.player.setVelocityX(-speed);
        }
        this.player.flipX = true;
        this.player.body.acceleration.x = -50;
        this.player.body.maxVelocity.x = 210;
        this.player.anims.play('walk', true);
      }
    }
    // Move Right
    else if (movement.D.isDown && this.mobile == true){
      if(this.bootsObtained == true){
        if(Phaser.Input.Keyboard.JustDown(specialButton)){
          this.mobile = false;
          this.player.body.setAllowGravity(false);
          this.player.setVelocityY(0);
          this.player.body.maxVelocity.x = 768;
          this.player.setVelocityX(768);
          this.player.anims.play('dash', true);
          this.time.delayedCall(250,this.dashFinish, null, this );
        }
        else{
          if (this.player.body.velocity.x < speed){
            this.player.setVelocityX(speed);
            }
            this.player.flipX = false;
            this.player.body.acceleration.x = 50;
            this.player.body.maxVelocity.x = 210;
            this.player.anims.play('walk', true);
        }
      }
      else{
        if (this.player.body.velocity.x < speed){
          this.player.setVelocityX(speed);
          }
          this.player.flipX = false;
          this.player.body.acceleration.x = 50;
          this.player.body.maxVelocity.x = 210;
          this.player.anims.play('walk', true);
        }
      }
    // Idle
    else {
      if (this.player.body.onFloor()){
        this.player.anims.play('idle', true);
        this.player.setVelocityX(0);
        this.player.body.acceleration.x = 0;
      }
    }
    //Jump command
    if(Phaser.Input.Keyboard.JustDown(jumpButton) && this.mobile == true){
      if (this.bootsObtained == true){
        if(this.jumpCount > 0){
          this.jumpCount --;
          this.player.setVelocityY(-225);
          this.jumpSound.play();
        }
      }
      else{
        if(this.jumpCount > 1){
          this.jumpCount --;
          this.player.setVelocityY(-225);
          this.jumpSound.play();
        }
      }
    }
    //fast falling for quick movement
    else if(movement.S.isDown && !this.player.body.onFloor() && this.mobile == true){
      if (this.player.body.velocity.y < 300){
        this.player.setVelocityY(300);
      }
    }
    //player shoots a bullet
    if (Phaser.Input.Keyboard.JustDown(bang)){
      if(this.player.flipX == false){
        var velocity = {x: 1000, y: 0};
      }
      else{
        var velocity = {x: -1000, y: 0};
      }
      var bullet = this.bullets.get();
      bullet.enableBody(true, this.player.x, this.player.y, true, true)
      .setVelocity(velocity.x, velocity.y);
      bullet.body.setAllowGravity(false);
      // Play gun noise
      this.gunSound.play();
    }
    //player's bullet kills enemies or falls out of bounds and despawns
    this.bullets.children.each(
      function (b) {
        if (b.active) {
          //if bullet touches enemyGroup, calls function
          this.physics.add.overlap(
            b,
            this.enemyGroup,
            this.hitEnemy,
            null,
            this
          );
            //refresh bullet group
            if (b.y < this.player.y - 300) { //if bullet off top of screen
              b.setActive(false);
            }
            else if (b.y > this.player.y + 300) { //if bullet off bottom of screen
              b.setActive(false);
            }
            else if (b.x < this.player.x -400){
              b.setActive(false);
            }
            else if (b.x > this.player.x + 400){
              b.setActive(false);
            }
        }
      }.bind(this) //binds to each children
  );
    //player uses their shield to block a bullet
    if (this.shieldObtained == true){
      //summon shield when pressing p and s down
      if (Phaser.Input.Keyboard.JustDown(specialButton) && movement.S.isDown){
        this.player.setVelocityY(0);
        this.player.setVelocityX(0);
        if (this.player.flipX == true){
          this.shine = this.physics.add.sprite(this.player.x - 16, this.player.y, 'shine');
          }
        else{
          this.shine = this.physics.add.sprite(this.player.x + 16, this.player.y, 'shine');
        }
        this.shine.body.setAllowGravity(false);
        this.player.body.setAllowGravity(false);
        this.mobile = false;
        this.player.body.acceleration.x = 0;
        this.player.anims.play('idle', true);
      }
      //upon releasing specialButton if shield is out remove it
      if (Phaser.Input.Keyboard.JustUp(specialButton)){
        if (this.shine != undefined ){
          this.shine.destroy();
          this.player.body.setAllowGravity(true);
          this.mobile = true;
        }
      }
    }
    //enemys's bullet injure player
    this.enemyBullets.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap( //if bullet touches player, calls function
            b,
            this.player,
            this.hitPlayer,
            null,
            this
            );
          this.physics.add.overlap(
            b,
            this.shine,
            this.hitShield,
            null,
            this
            );
          //refresh bullet group
          //enemy bullets despawn when they fall off the map
          if (b.y < 0) {
            b.setActive(false);
            }
          else if (b.y > 2400) {
            b.setActive(false);
            }
          else if (b.x < 0){
            b.setActive(false);
            }
          else if (b.x > 4480){
            b.setActive(false);
            }
          }
        }.bind(this) //binds to each children
    );
    //player's bullet kills enemies
    this.bullets.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap( //if bullet touches enemyGroup, calls function
            b,
            this.enemyGroup,
            this.hitEnemy,
            null,
            this
          );
          this.physics.add.overlap( //if bullet touches boss, calls function
            b,
            this.boss,
            this.hitBoss,
            null,
            this
          );
          //refresh bullet group
          if (b.y < 0) { //if bullet off top of screen
            b.setActive(false);
          }
          else if (b.y > 600) { //if bullet off bottom of screen
            b.setActive(false);
          }
          else if (b.x < 0){
            b.setActive(false);
          }
          else if (b.x > 800){
            b.setActive(false);
          }
        }
      }.bind(this) //binds to each children
    );
    //enemys's bullet injure player
    this.enemyBullets.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap( //if bullet touches player, calls function
            b,
            this.player,
            this.hitPlayer,
            null,
            this
            );
          this.physics.add.overlap(
            b,
            this.shine,
            this.hitShield,
            null,
            this
            );
          //refresh bullet group
          //enemy bullets despawn when they fall off the map
          if (b.y < 0) {
            b.setActive(false);
            }
          else if (b.y > 2400) {
            b.setActive(false);
            }
          else if (b.x < 0){
            b.setActive(false);
            }
          else if (b.x > 4480){
            b.setActive(false);
            }
          }
        }.bind(this) //binds to each children
      );
    }//END OF UPDATE FUNCTION
  //additional functions to be called

  //triggers when player bullet hits a wall
  hitWall(bullet, wall){
    if (bullet.active) {
        bullet.disableBody(true, true);
    }
  }

  //called after time for the players dash move to complete
  dashFinish(){
    this.player.setVelocityX(0);
    this.player.body.setAllowGravity(true);
    this.player.body.acceleration.x = 0;
  }
  //enemy fires a projectile at the player
  enemyShoot (enemy, bullets, player){
    var distance = enemy.x - player.x;
    //only fire if enemy active and certain distance
    if(enemy.active){
      if(distance < 450 && distance > -450){
        if(distance <= 0){
          enemy.flipX = true
          var velocity = {x: 700, y: 0};
        }
        else{
          enemy.flipX = false
          var velocity = {x: -700, y: 0};
        }
        var bullet = bullets.get();
        bullet.enableBody(true, enemy.x, enemy.y, true, true)
            .setVelocity(velocity.x, velocity.y);
        bullet.body.setAllowGravity(false);
      }
    }
  }
  //targeted version of above function
  enemyShootTargeted (enemy, bullets, player) {
    var distance = enemy.x - player.x;
    var distanceY = enemy.y - player.y;
    if(enemy.active){
      if(distanceY < 600 && distanceY > -600){
        if(distance < 800 && distance > -800){ //only fire is enemy active and certain distance
          var betweenPoints = Phaser.Math.Angle.BetweenPoints;
          var angle = betweenPoints(enemy, this.player);
          var velocityFromRotation = this.physics.velocityFromRotation;
          //create variable called velocity from a vector2
          var velocity = new Phaser.Math.Vector2();
          velocityFromRotation(angle, 500, velocity);
          //get bullet group
          var bullet = bullets.get();
          bullet.setAngle(Phaser.Math.RAD_TO_DEG * angle);
          bullet.enableBody(true, enemy.x, enemy.y, true, true)
                .setVelocity(velocity.x, velocity.y);
                bullet.body.setAllowGravity(false);
          }
        }
      }
    }
  //triggers when player hits an enemy
  hitEnemy(bullet, enemy){
    enemy.disableBody(true, true);
    bullet.disableBody(true, true);
    //play hurt sound
    var randomSpeed = (Math.random()*0.4)+0.5;
    this.screamSound.setRate(randomSpeed);
    this.screamSound.play();
  }
  //triggers when player is hit by an enemy with a projectile
  hitPlayer(bullet, player){
    bullet.disableBody(true, true);
    this.peggyScream.play();
    this.healthHurt();
  }
  //when bullet hits shield
  hitShield(bullet, shield){
      bullet.disableBody(true, true);
  }
  //If player loses health add one to health hurt score
  healthHurt(){
    // If the user has waited a second since last hit
    if (!this.waitASecond){
      this.peggyScream.play();
      // Enable hit and wait another second after this completes
      this.waitASecond = true;
      // Set the timer to now
      this.startTime = Date.now();
      // Add one hit to the player's health
      this.gameHealth += 1;
      // Update the health bar
      if (this.gameHealth <= 13){

          // Create a temporary path for the animation
          var tempStringPath = "healthActive";
          tempStringPath += this.gameHealth;

          // Create the animation for the Health bar to switch to
          this.anims.create({
            key: tempStringPath,
            frames: this.anims.generateFrameNumbers("health", {start: this.gameHealth, end: this.gameHealth}),
            frameRate: 1,
            repeat: -1
          });
          this.healthbar.anims.play(tempStringPath, true);

        }
      // Check if it's past empty, and if so, game over
      else{
        this.gameOver();
      }
      //Wait a second
    }
  }
  //triggers when enemy is hit
  hitBoss(bullet, boss){
    bullet.disableBody(true, true);
    this.bossHurt();
  }
  //If boss loses health --------------------------------------------------------
  bossHurt(){
    //lose heart or die
    this.health = 3;
    this.bossHealth -= 1;
    if(this.bossHealth == 2){
      this.health = 2;
    }
    else if(this.bossHealth == 1){
      this.health = 1;
    }
    else if(this.bossHealth == 0){
      this.success();
      return
     }
    //respawn peggy
    while(this.gameMusic.isPlaying){
      this.gameMusic.stop();
    }
    this.scene.restart({health: this.gameHealth, lives: this.health });
    }
  //end game, goes to game over scene
  gameOver(){
    // Stop music if playing
    this.gameMusic.stop();
    while(this.gameMusic.isPlaying){
      this.gameMusic.stop();
    }
    console.log('game over!');
    this.scene.start('GameOver');
  }
  //successfully completed game, changes to success scene
  success(){
    //Stop the music
    this.gameMusic.stop();
    while(this.gameMusic.isPlaying){
      this.gameMusic.stop();
    }
    console.log('success!');
    this.scene.start('SuccessScene');
  }

}
