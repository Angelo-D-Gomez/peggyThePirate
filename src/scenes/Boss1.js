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
    this.load.image('boss', './assets/Boss1/bossPirate.png');


    //Load tilemap and tileset
    this.load.image('tiles', './assets/Boss1/shipAndBeachTiles.png');
    this.load.tilemapTiledJSON('map', './assets/Boss1/bossRoom1.json');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
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

    this.boss = this.physics.add.sprite(400, 96, 'boss');
    this.boss.setScale(2);
    this.physics.add.collider(this.boss, platforms);





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
      this.player.anims.play('idle', true);
      this.player.setVelocityX(0);
    }
    // player can jump if they are touching the ground
    // removed the bounce because it means you cant jump right away after
    // intial jump because the bounce puts them in air
    if (movement.W.isDown && this.player.body.onFloor()){
      this.player.setVelocityY(-225);
    }
    //allows fast falling for more player mobility
    // jump and fall speed need to be experimented with
    else if(movement.S.isDown && !this.player.body.onFloor()){
      this.player.setVelocityY(300);
    }
  }
}
