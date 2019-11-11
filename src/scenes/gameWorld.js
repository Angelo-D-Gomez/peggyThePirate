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

  preload () {
    // Preload assets
    // Preload assets
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

  create (data) {
    //Create the scene
    this.player = this.physics.add.sprite(4000, 3968, 'peggy');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);


    this.physics.world.setBounds(0, 0, 8000, 8000);
    this.cameras.main.setBounds(0, 0, 8000, 8000);
    this.cameras.main.startFollow(this.player);

    const world = this.make.tilemap({ key: 'gameWorld' });
    var tempTile = world.addTilesetImage('tempTile', 'tempTile');
    const platforms = world.createStaticLayer('tempTile', tempTile, 0, 0);
    platforms.setCollisionByExclusion(-1, true);

    //player can stand on the platforms
    this.physics.add.collider(this.player, platforms);
  }

  update (time, delta) {
    // Update the scene
  }
}
