/*global Phaser*/
// this scene exists for experimenting with different
// additions of mechanics and physics in the game
export default class test extends Phaser.Scene {
  constructor () {
    super('test');
  }

  init (data) {
    // Initialization code goes here
    this.bootsObtained = false;
    this.jumpCount = 2;
    this.mobile = true;
    this.bootsObtained = false
  }

  preload () {
    // Preload assets
    this.load.spritesheet('peggy', "./assets/spritesheets/mainCharacter-gun.png", {
      frameHeight: 32,
      frameWidth: 32
    });
    this.load.spritesheet('peggyBoots', "./assets/spritesheets/peggyGold.png", {
      frameHeight: 32,
      frameWidth: 32
    });
    this.load.image('bullet', './assets/sprites/bulletSmall.png');

    this.load.image('shine', './assets/sprites/shine.png');

    //Load tilemap and tileset
    this.load.image('tiles', './assets/testing/basicTiles.png');
    this.load.tilemapTiledJSON('map', './assets/testing/testWorld.json');

    // Load the gun/jump sound effect
    this.load.audio('gunAudio', './assets/audio/477346__mattiagiovanetti__some-laser-gun-shots-iii.mp3');
    this.load.audio('jumpAudio', './assets/audio/277219__thedweebman__8-bit-jump-2.mp3');

    //boots
    this.load.image('boots', './assets/sprites/goldShoes.png' );

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {


    this.gunSound = this.sound.add('gunAudio');
    this.jumpSound = this.sound.add('jumpAudio');
    this.jumpSound.volume = 0.1;

    this.player = this.physics.add.sprite(32, 576, 'peggy');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);

    this.physics.world.setBounds(0, 0, 1536, 640);

    this.cameras.main.setBounds(0, 0, 1536, 640);
    this.cameras.main.startFollow(this.player);






    const map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('basicTiles', 'tiles');
    const platforms = map.createStaticLayer('ground', tileset, 0, 0);
    platforms.setCollisionByExclusion(-1, true);

    //player can stand on the platforms
    this.physics.add.collider(this.player, platforms);

    this.boots = this.physics.add.sprite(320, 576,'boots');
    this.physics.add.collider(this.boots, platforms);


    this.physics.add.overlap(this.player, this.boots, this.getBoots, null, this);

    this.shine = this.physics.add.group({
      defaultKey: "shine",
      maxSize: 1
    });

    //add player's bullet group
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });
    this.bullets.children.iterate(function(child){
    }
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
  this.anims.create({
    key: "dash",
    frames: this.anims.generateFrameNumbers('peggy', {start:4, end:4}),
    framerate: 60,
    repeat: -1
  });

  }

  update (time, delta) {
    // Update the scene
    //1000 ms = 60 frames
    //16.7 ms = 1 frame
    // Player Movement with WASD and shift to sprint
    var movement = this.input.keyboard.addKeys('A, S, D');
    var jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    var dashButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    var specialButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    var bang = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    var speed = 210;



    if (this.player.body.onFloor()){
        this.jumpCount = 2;
        this.mobile = true;
    }
        // Move Left
    if (movement.A.isDown && this.mobile == true){
      if (Phaser.Input.Keyboard.JustDown(dashButton)){
        console.log('ldash');
        this.player.body.setAllowGravity(false);
        this.player.setVelocityX(0);
        this.player.anims.play('dash', true);
        this.player.x -= 160;
        this.player.body.setAllowGravity(true);
        this.mobile = false;
      }
      else{
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
      this.player.anims.play('walk', true);
    }
    }
    // Move Right
    else if (movement.D.isDown && this.mobile == true){
      if(Phaser.Input.Keyboard.JustDown(dashButton)){
          console.log('rdash');
          this.player.body.setAllowGravity(false);
          this.player.setVelocityX(0);
          this.player.anims.play('dash', true);
          this.player.x += 160;
          this.player.body.setAllowGravity(true);
          this.mobile = false;
      }
      else{
      this.player.setVelocityX(speed);
      this.player.flipX = false;
      this.player.anims.play('walk', true);
    }
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

    if(Phaser.Input.Keyboard.JustDown(jumpButton) && this.mobile == true){
      if(this.jumpCount > 0){
        this.jumpCount --;
        this.player.setVelocityY(-225);
        this.jumpSound.play();
    }
  }
  //fast falling for quick movement
    else if(movement.S.isDown && !this.player.body.onFloor()){
      this.player.setVelocityY(300);
}




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

    if (Phaser.Input.Keyboard.JustDown(specialButton)){

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


  }

}
