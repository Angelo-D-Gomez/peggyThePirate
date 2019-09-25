/*global Phaser*/
import * as ChangeScene from'./Changescene.js';
export default class Level1 extends Phaser.Scene {
  constructor () {
    super('Level1');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {

    this.load.image("peggy", "./assets/spritesheets/mainCharacter")

    this.load.spritesheet('peggy', "./assets/spritesheets/mainCharacter-gun.png", {
      frameHeight: 32,
      frameWidth: 32
    });
    this.load.image('bullet', './assets/sprites/bomb.png');
    this.load.image("desert", "./assets/sprites/background.png");
    this.load.image("ground", "./assets/sprites/platform.png");
    this.load.image("enemy", "./assets/sprites/player_sprite.png");
    this.load.image('L1', './assets/Level_1/LVL1.0.png')

/*
    //attemping to load tile map
    this.load.image('tiles', './assets/Level_1/temp_tile.png');
    this.load.tilemapTiledJSON('map', './assets/Level_1/Level_1.json');
*/

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    ChangeScene.addSceneEventListeners(this);
    var score;
    this.score = 0;
    var background = this.add.sprite(1280/2, 960/2, "desert");
    this.player = this.physics.add.sprite(50, 50, 'peggy');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);
    this.physics.world.setBounds(0, 0, 1280, 960);
    this.player.setBounce(0.2);
    this.cameras.main.setBounds(0, 0, 1280, 960);
    this.cameras.main.startFollow(this.player);

/*
    // tile map failure
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tile1.0', 'tiles');
*/

    //  The platforms group contains the ground and the 2 ledges we can jump on
    //var platforms = this.physics.add.staticGroup();
    var bullets, enemy, bullet, enemyGroup;
    this.nextFire = 0;
    this.fireRate = 200;
    this.speed = 1000;

    //alt name for platforms since using LVL1.0
    var ground = this.add.image(1280/2, 960/2, 'L1');
    ground.setScale(2);
    ground = this.physics.add.staticGroup();
    this.physics.add.collider(this.player, ground);

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
/*
    platforms
      .create(1280, 1000, "ground")
      .setScale(7)
      .refreshBody();


    //  Now let's create some ledges
    platforms.create(600, 400, "ground");
    platforms.create(50, 600, "ground");
    platforms.create(750, 700, "ground");
*/
    //add bullet group
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });

    //how to get gravity of bullets to be zero??
    this.bullets.children.iterate(function(child){
      child.body.gravity.y = 0;
      child.body.gravity.x = 0;
    });

    //automate adding multiple enemies to an enemy
    this.enemyGroup = this.physics.add.group({
      key: 'enemy',
      repeat: 4,
      setXY: {
        x: 200,
        y: 100,
        stepX: 300,
        stepY: 200
      }
    });

    this.enemyGroup.children.iterate(function(child){
      child.setScale(0.5);
      child.setCollideWorldBounds(true);
    });
/*
    //collisions
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.enemyGroup, platforms);
*/
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

    var cursors = this.input.keyboard.createCursorKeys();
    var speed = 5;

    this.input.on(
  "pointermove",
  function(pointer){}, this
);
this.input.on("pointerdown", this.shoot, this);

    if (cursors.left.isDown){
      this.player.x -= speed;
      this.player.flipX = true;
      this.player.anims.play('walk', true);
    }

    else if (cursors.right.isDown){
      this.player.x += speed;
      this.player.flipX = false;
      this.player.anims.play('walk', true);
    }

    else {
      this.player.anims.play('idle', true);
    }

    if (cursors.down.isDown){
      this.player.y += speed;
    }

    else if (cursors.up.isDown){
      this.player.y -= speed;
    }

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
              else if (b.y > this.cameras.main.height) { //if bullet off bottom of screen
                b.setActive(false);
              }
              else if (b.x < 0){
                b.setActive(false);
              }
              else if (b.x > this.cameras.main.width){
                b.setActive(false);
              }
            }
          }.bind(this) //binds to each children
        );
}

shoot(pointer) {
  if(this.player.flipX == false){
    var velocity = {x: 1000, y: 0};
  }
  else{
    var velocity = {x: -1000, y: 0};
  }
  var bullet = this.bullets.get();
  bullet.enableBody(true, this.player.x, this.player.y, true, true)
  .setVelocity(velocity.x, velocity.y);
}

  hitEnemy(bullet, enemy){
    console.log('hit');
    enemy.disableBody(true, true);
    bullet.disableBody(true, true);
    this.score += 1;
    console.log(this.score);
    if(this.score >= 5){
      this.success();
    }
  }

  gameOver(){
    //end game, goes to game over scene
    console.log('game over!');
  }

  success(){
      console.log('success!');
      this.scene.start('successScene');
      //successfully completed game, changes to success scene
  }
}
