/*global Phaser*/
export default class Boss1 extends Phaser.Scene {
  constructor () {
    super('Boss1');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    //Peggy spritesheet
    this.load.spritesheet('peggy', "./assets/spritesheets/mainCharacter-gun.png", {
      frameHeight: 32,
      frameWidth: 32
    });
    //Boss sprite (maybe create sprite sheet for him to give him a
    // some life with animations)
    this.load.image('boss', './assets/Boss1/bossPirate3.png');

    //background
    this.load.image('background', './assets/Boss1/bossBackground.png');

    //other game objects
    this.load.image('bullet', './assets/sprites/bulletSmall.png');
    this.load.image('cannon', './assets/sprites/cannon.png');
    this.load.image("enemy", "./assets/possibleAssets/pirate.png");


    //Load tilemap and tileset
    this.load.image('tiles', './assets/Boss1/shipAndBeachTiles.png');
    this.load.tilemapTiledJSON('map', './assets/Boss1/bossRoom1.json');

    // Load the gun/jump sound effect
    this.load.audio('gunAudio', './assets/audio/477346__mattiagiovanetti__some-laser-gun-shots-iii.mp3');
    this.load.audio('jumpAudio', './assets/audio/277219__thedweebman__8-bit-jump-2.mp3');
    this.load.audio('gameAudio', './assets/audio/JonECopeLoop1.mp3');
    this.load.audio('screamAudio', './assets/audio/Wilhelm_Scream_wikipedia(public).ogg');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    var bullets;
  }

  create (data) {
    //load level background first, everything built on top of it
    var background = this.add.image(800/2, 600/2, "background");

    // initialize audio effects
    this.gameMusic = this.sound.add('gameAudio');
    this.gameMusic.volume = 0.1;
    this.gunSound = this.sound.add('gunAudio');
    this.jumpSound = this.sound.add('jumpAudio');
    this.jumpSound.volume = 0.1;
    this.screamSound = this.sound.add('screamAudio');

    //speed up the music
    this.gameMusic.setRate(1.5);
    this.gameMusic.setLoop(true);
    this.gameMusic.play();


    //Create player character
    this.player = this.physics.add.sprite(400, 550, 'peggy');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);

    //create world bounds
    this.physics.world.setBounds(0, 0, 800, 600);

    //create level camera
    this.cameras.main.setBounds(0, 0, 800, 600);
    this.cameras.main.startFollow(this.player);


    //create level layout
    const map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('shipAndBeachTiles', 'tiles');
    const platforms = map.createStaticLayer('Boss Room Platforms', tileset, 0, 0);
    platforms.setCollisionByExclusion(-1, true);


    //player can stand on the platforms
    this.physics.add.collider(this.player, platforms);

    //add Boss character to level
    this.boss = this.physics.add.sprite(512, 96, 'boss');
    this.boss.setScale(2)
              .flipX = true;

    this.physics.add.collider(this.boss, platforms);




    //add his cannons
    this.cannon1 = this.physics.add.sprite(64, 64, 'cannon');
    this.cannon1.setScale(2);
    this.cannon2 = this.physics.add.sprite(736, 64, 'cannon');
    this.cannon2.setScale(2);
    this.physics.add.collider(this.cannon1, platforms);
    this.physics.add.collider(this.cannon2, platforms);

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

    this.physics.add.collider(this.enemyGroup, platforms);

      this.enemyGroup.add(this.boss);

    this.nextFire = 0;
    this.fireRate = 200;

    //add player's bullet group
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });
    this.bullets.children.iterate(function(child){
      child.body.gravity.y = 0;
      child.body.gravity.x = 0;
});
    //add enemy's bullet group
    this.enemyBullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 100
});
    //how to get gravity of bullets to be zero??
    this.enemyBullets.children.iterate(function(child){
      child.body.gravity.y = 0;
      child.body.gravity.x = 0;
});


//cannon1 and cannon2- doesn't move but shoots targeted bullets for player to dodge
this.tweens.add({
  targets: this.cannon1,
  ease: "Linear",
  x: '-=0',
  delay: 1000,
  duration: 3000,
  yoyo: true,
  repeat: -1,
  flipX: true,
  onRepeat: function(){this.enemyShootTargeted(this.cannon1, this.enemyBullets)},
 onRepeatScope: this
});
this.tweens.add({
  targets: this.cannon2,
  ease: "Linear",
  x: '-=0',
  delay: 1000,
  duration: 3000,
  yoyo: true,
  repeat: -1,
  flipX: true,
  onRepeat: function(){this.enemyShootTargeted(this.cannon2, this.enemyBullets)},
 onRepeatScope: this
});
// pirate boss Movement
this.tweens.add({
  targets: this.boss,
  x: '-=224',
  ease: "Linear",
  delay: 1000,
  duration: 3000,
  yoyo: true,
  repeat: -1,
  flipX: true
});
//now tweens for the lil guys movements
//enemy 1
this.tweens.add({
  targets: this.enemy1,
  x: '-=180',
  ease: "Linear",
  delay: 1000,
  duration: 3000,
  yoyo: true,
  repeat: -1,
  flipX: true
});
// enemy 2
this.add.tween({
  targets: this.enemy2,
  x: '-=180',
  ease: "Linear",
  delay: 2000,
  duration: 2000,
  yoyo: true,
  repeat: -1,
  flipX: true,
  onRepeat: function(){this.enemyShoot(this.enemy2, this.enemyBullets)},
 onRepeatScope: this
});
this.add.tween({
  targets: this.enemy3,
  x: '-=384',
  ease: "Linear",
  delay: 2000,
  duration: 2000,
  yoyo: true,
  repeat: -1,
  flipX: true,
  onRepeat: function(){this.enemyShoot(this.enemy3, this.enemyBullets)},
 onRepeatScope: this
});


//if player touches enemy
this.enemyGroup.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap( //if enemyGroup touches player, calls function
            b,
            this.player,
            this.gameOver,
            null,
            this
          );
        }
      }.bind(this) //binds to each children
    );


    // animations
    // Peggy animations
    //create animation from spritesheet
  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers('peggy', {start: 1, end: 5}),
    frameRate: 10,
    repeat: -1 //repeat forever
  });
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers('peggy', {start:0, end:0}),
    frameRate: 10,
    repeat: -1
  });



  }

  update (time, delta) {
    // Player Movement with WASD and shift to sprint
    var movement = this.input.keyboard.addKeys('W, A, S, D, SHIFT');
    var speed;

    // Hold down shift to make Peggy sprint
    // this must come before input detection of WASD because
    // otherwise it wont change the speed variable before she
    // starts moving
    if (movement.SHIFT.isDown){
      speed = 210;
    }
    else{
      speed = 135;
    }
    // Move Left
    if (movement.A.isDown){
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
      this.player.anims.play('walk', true);
    }
    // Move Right
    else if (movement.D.isDown){
      this.player.setVelocityX(speed);
      this.player.flipX = false;
      this.player.anims.play('walk', true);
    }
    // Idle
    else {
      if (this.player.body.onFloor()){
      this.player.anims.play('idle', true);
      this.player.setVelocityX(0);
      }
    }
    // player can jump if they are touching the ground
    // removed the bounce because it means you cant jump right away after
    // intial jump because the bounce puts them in air
    if (movement.W.isDown && this.player.body.onFloor()){
      this.player.setVelocityY(-225);
      this.jumpSound.play();
    }
    //allows fast falling for more player mobility
    // jump and fall speed need to be experimented with
    else if(movement.S.isDown && !this.player.body.onFloor()){
      this.player.setVelocityY(300);
    }

    //Player fires weapon
    var bang = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);

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
      // Play gun noise
      this.gunSound.play();
    }

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

        //enemys's bullet kills player
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


  }


//player shoots
shoot() {
  if(this.player.flipX == false){
    var velocity = {x: 1000, y: 0};
  }
  else{
    var velocity = {x: -1000, y: 0};
  }
  var bullet = this.bullets.get();
  bullet.enableBody(true, this.player.x, this.player.y, true, true)
  .setVelocity(velocity.x, velocity.y);
  // Play gun noise
  this.gunSound.play();
}

//function for enemy to shoot in a straight line, no aim
enemyShoot (enemy, bullets) {
  console.log('enemy shoots!');
  if(enemy.active){
  if(enemy.flipX == true){
    var velocity = {x: 700, y: 0};
  }
  else{
    var velocity = {x: -700, y: 0};
  }
  var bullet = bullets.get();
  bullet.enableBody(true, enemy.x, enemy.y, true, true)
  .setVelocity(velocity.x, velocity.y);
}
}


//targeted version of above function
enemyShootTargeted (enemy, bullets) {
  console.log('enemy shoots, targeted!');
  if(enemy.active){
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
}
}

//triggers when enemy is hit
hitEnemy(bullet, enemy){
  console.log('hit');
  enemy.disableBody(true, true);
  bullet.disableBody(true, true);
  //play hurt sound
  this.screamSound.play();
  if (this.boss.body.enable == false){
    this.success()
  }
}

//triggers when player is hit
    hitPlayer(bullet, player){
      console.log('hit');
      player.disableBody(true, true);
      bullet.disableBody(true, true);
      // Play hurt Sound
      this.screamSound.play();
      this.scene.start('GameOver');
    }


//end game, goes to game over scene
gameOver(){
  // Stop music if playing
  this.gameMusic.stop();
console.log('game over!');
this.scene.start('GameOver');
}
//successfully completed game, changes to success scene
success(){
  //Stop the music
  this.gameMusic.stop();
    console.log('success!');
    this.scene.start('successScene');
}

}
