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
    this.spriteValue = 7;

  }

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


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

//Create the scene
  create (data) {

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
    


  }

  update (time, delta) {
    // Update the scene
  }
}
