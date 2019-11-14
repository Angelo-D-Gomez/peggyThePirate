/*global Phaser*/
export default class gameWorld extends Phaser.Scene {
  constructor () {
    super('gameWorld');
  }

  init (data) {
    // Initialization code goes here

    // Load the health score
    this.gameHealth = 0;
    this.waitASecond = false;
    this.startTime = Date.now();
    this.peggyHurt1 = false;
    //for double jumping
    this.bootsObtained = false;
    this.jumpCount = 2;
    this.mobile = true;
    this.spriteValue = 0;

  }//END OF DATA INITIALIZATION

// Preload assets
  preload () {
    //the player's spritesheet
    this.load.spritesheet('peggy', "./assets/spritesheets/combinedSpritesheet.png", {
      frameHeight: 32,
      frameWidth: 32
    });

    //Load tilemap and tileset
    this.load.image('tempTile', './assets/gameWorld/tempTile.png');
    this.load.tilemapTiledJSON('gameWorld', './assets/gameWorld/gameWorld.json');

    // Load the gun/jump sound effect
    this.load.audio('gunAudio', './assets/audio/477346__mattiagiovanetti__some-laser-gun-shots-iii.mp3');
    this.load.audio('jumpAudio', './assets/audio/277219__thedweebman__8-bit-jump-2.mp3');


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }//END OF PRELOAD FUNCTION

//Create the scene
  create (data) {

    //Put Sounds for game here
    this.gunSound = this.sound.add('gunAudio');
    this.gunSound.volume = 0.3;
    this.jumpSound = this.sound.add('jumpAudio');
    this.jumpSound.volume = 0.05;

    //create the player and add them to the scene
    this.player = this.physics.add.sprite(4000, 3968, 'peggy');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);

    //create the game world and set the camera to follow the player
    this.physics.world.setBounds(0, 0, 8000, 8000);
    this.cameras.main.setBounds(0, 0, 8000, 8000);
    this.cameras.main.startFollow(this.player);

    //create the game world by adding each tileset using the
    //tilemap and creating collision with the player
    const world = this.make.tilemap({ key: 'gameWorld' });
    var tempTile = world.addTilesetImage('tempTile', 'tempTile');
    const platforms = world.createStaticLayer('tempTile', tempTile, 0, 0);
    platforms.setCollisionByExclusion(-1, true);

    this.physics.add.collider(this.player, platforms);

    //Peggy's animations
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers('peggy', {start: this.spriteValue, end: this.spriteValue + 5}),
      frameRate: 10,
      repeat: -1 //repeat forever
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers('peggy', {start:this.spriteValue, end:this.spriteValue}),
      frameRate: 10,
      repeat: -1
    });


  }//END OF CREATE FUNCTION
      // Update the scene
  update (time, delta) {
    //all player input buttons
    var movement = this.input.keyboard.addKeys('A, S, D');
    var jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    var dashButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    var specialButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    var bang = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    var speed = 140;



    //if player is on ground, reset jump jumpCount to 2
    //and reset player's mobility
    if (this.player.body.onFloor()){
        this.jumpCount = 2;
        this.mobile = true;
    }
    // Move Left
    if (movement.A.isDown && this.mobile == true){
      if (this.bootsObtained == true){
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



  }//END OF UPDATE FUNCTION
}
