/*global Phaser*/
export default class Level1v2 extends Phaser.Scene {
  constructor () {
    super('Level1v2');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    // Peggy spritesheet
    this.load.spritesheet('peggy', "./assets/spritesheets/mainCharacter-gun.png", {
      frameHeight: 32,
      frameWidth: 32
    });

    //projectiles
    this.load.image('bullet', './assets/sprites/bulletSmall.png');
    this.load.image('coconut', './assets/sprites/coconut_small.png');


    // load background
    this.load.image('beachBackground', './assets/Level1.1/beachArtwork.png');

    //load enemies
    this.load.image('monkey', './assets/Level1.1/monkey.png');
    this.load.image('crab', './assets/Level1.1/crab_small.png');
    this.load.image("enemy", "./assets/possibleAssets/pirate.png");
    this.load.image("swordenemy", "./assets/possibleAssets/pirates.v1 copy.png");
    this.load.image("sword", "./assets/possibleAssets/sword.png");


    //load tile map
    this.load.image('jungleTiles', './assets/Level1.1/jungleTileSheet.png');
    this.load.image('beachTiles', './assets/Level1.1/shipAndBeachTiles.png');
    this.load.tilemapTiledJSON('map', './assets/Level1.1/Level 1 V2.json');

    // Load the gun/jump sound effect
    this.load.audio('gunAudio', './assets/audio/477346__mattiagiovanetti__some-laser-gun-shots-iii.mp3');
    this.load.audio('jumpAudio', './assets/audio/277219__thedweebman__8-bit-jump-2.mp3');


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var beachBackground = this.add.image(1200, 600, "beachBackground");
    beachBackground.setScale(3);

    this.gunSound = this.sound.add('gunAudio');
    this.jumpSound = this.sound.add('jumpAudio');
    this.jumpSound.volume = 0.1;

    this.player = this.physics.add.sprite(32, 546, 'peggy');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);

    this.physics.world.setBounds(0, 0, 8000, 1920);

    this.cameras.main.setBounds(0, 0, 8000, 1920);
    this.cameras.main.startFollow(this.player);



    // tile map
    const map = this.make.tilemap({ key: 'map' });
    var tileset1 = map.addTilesetImage('jungleTileSheet', 'jungleTiles');
    var tileset2 = map.addTilesetImage('shipAndBeachTiles', 'beachTiles');
    const platforms = map.createStaticLayer('beach', tileset2, 0, 0);
    const platforms2 = map.createStaticLayer('jungle', tileset1, 0, 0);
    platforms.setCollisionByExclusion(-1, true);
    platforms2.setCollisionByExclusion(-1, true);

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, platforms2);

    //add player's bullet group
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });
    this.bullets.children.iterate(function(child){
    }
  );

  //add enemy's bullet group
  this.enemyBullets = this.physics.add.group({
    defaultKey: "bullet",
    maxSize: 100
});
  //how to get gravity of bullets to be zero??
  this.enemyBullets.children.iterate(function(child){
});
  //add enemy's coconut enemyGroup    //add enemy's bullet group
      this.enemyCoconuts = this.physics.add.group({
        defaultKey: "coconut",
        maxSize: 100
  });
      //how to get gravity of bullets to be zero??
      this.enemyCoconuts.children.iterate(function(child){
  });

    //create enemy group
    this.enemyGroup = this.physics.add.group({});

    //adding crab enemies
    this.crab1 = this.physics.add.sprite(736, 544, 'crab');
    this.enemyGroup.add(this.crab1);

    //adding monkey enemies
    this.monkey1 = this.physics.add.sprite(2288, 448, 'monkey');
    this.enemyGroup.add(this.monkey1);
    this.monkey2 = this.physics.add.sprite(2176, 288, 'monkey');
    this.enemyGroup.add(this.monkey2);
    this.monkey3 = this.physics.add.sprite(2340, 160, 'monkey');
    this.enemyGroup.add(this.monkey3);


    this.physics.add.collider(this.enemyGroup, platforms);
    this.physics.add.collider(this.enemyGroup, platforms2);



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

    //tweens

    //crab walking movement
    this.tweens.add({
      targets: this.crab1,
      x: '-=600',
      ease: "Linear",
      delay: 0,
      duration: 5000,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    //monkeys throw coconuts
     this.tweens.add({
      targets: this.monkey1,
      ease: "Linear",
      x: '-=0',
      delay: 1000, //add delay so monkey takes time to throw coconut
      duration: 3000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.monkey1, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });
    this.tweens.add({
      targets: this.monkey2,
      ease: "Linear",
      x: '-=0',
      delay: 1500,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.monkey2, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });
    this.tweens.add({
      targets: this.monkey3,
      ease: "Linear",
      x: '-=0',
      delay: 1250,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.monkey3, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });










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
    // Update the scene

    // Player Movement with WASD and shift to sprint
    var movement = this.input.keyboard  .addKeys('W, A, S, D, SHIFT');
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
          bullet.body.setAllowGravity(false);
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
                      else if (b.x < this.player.x - 400){
                        b.setActive(false);
                      }
                      else if (b.x > this.player.x + 400){
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

        this.enemyCoconuts.children.each(
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
              else if (b.y > 1920) { //if bullet off bottom of screen
                b.setActive(false);
              }
              else if (b.x < 0){
                b.setActive(false);
              }
              else if (b.x > 8000){
                b.setActive(false);
              }
            }
          }.bind(this) //binds to each children
        );

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
        bullet.body.setAllowGravity(false);
      }
      }


      //targeted version of above function
      enemyShootTargeted (enemy, bullets, player) {
        console.log('enemy shoots, targeted!');
        var distance = enemy.x - player.x
        console.log(distance)
        if(enemy.active){
          if(distance < 500){ //only fire is enemy active and certain distance
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


//triggers when enemy is hit
hitEnemy(bullet, enemy){
    console.log('hit');
    enemy.disableBody(true, true);
    bullet.disableBody(true, true);
    //play hurt sound
    //this.screamSound.play();

  }
//triggers when player is hit
hitPlayer(bullet, player){
        console.log('hit');
        player.disableBody(true, true);
        bullet.disableBody(true, true);
        // Play hurt Sound
        //this.screamSound.play();
        this.gameOver();
      }


//find distance between enemy and player
findDistance(player, enemy){
  distance = enemy.x - player.x
  console.log(distance)
  return(distance)
}


  //end game, goes to game over scene
  gameOver(){
    // Stop music if playing
  //this.gameMusic.stop();
  console.log('game over!');
  this.scene.start('GameOver');
  }


}
