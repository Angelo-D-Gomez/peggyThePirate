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
    //for double jumping
    this.bootsObtained = false;
    this.shieldObtained = false;
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

    // Load the health spriteSheet
    this.load.spritesheet('health', "./assets/spritesheets/healthSpriteSheet.png", {
      frameHeight: 48,
      frameWidth: 16
    });

    //Load tilemap and tileset
    this.load.image('tempTile', './assets/gameWorld/tempTile.png');
    this.load.image('jungleTileSheet', './assets/gameWorld/jungleTileSheet.png')
    this.load.image('beachTileSheet', './assets/gameWorld/shipAndBeachTiles.png')
    this.load.tilemapTiledJSON('gameWorld', './assets/gameWorld/gameWorld.json');

    //load backgrounds
    this.load.image('wallPaper', './assets/gameWorld/wallpaper.png');
    this.load.image('jungle', './assets/gameWorld/jungle.png');
    this.load.image('beachArtwork', './assets/gameWorld/beachArtwork.png');
    this.load.image('sky', './assets/gameWorld/openSourceSky.png');

    // Load sound effects and music for the game
    this.load.audio('gunAudio', './assets/audio/477346__mattiagiovanetti__some-laser-gun-shots-iii.mp3');
    this.load.audio('jumpAudio', './assets/audio/277219__thedweebman__8-bit-jump-2.mp3');
    this.load.audio('powerupAudio', './assets/audio/good(JonECope).mp3');
    this.load.audio('screamAudio', './assets/audio/Wilhelm_Scream_wikipedia(public).ogg');
    this.load.audio('peggyScream', './assets/audio/peggyScream.mp3');
    this.load.audio('gameAudio', './assets/audio/JonECopeLoop1-1.mp3');

    //load textbox
    this.load.image('textBorder', './assets/gameWorld/textBorder.png');

    //load the interactable world objects
    this.load.image('boots', './assets/gameWorld/goldShoes.png');
    this.load.image('shine', './assets/sprites/shine.png');
    this.load.image('pirateShip', './assets/gameWorld/pirateShip.png');

    //load enemy sprites
    this.load.image('enemyPirate', './assets/gameWorld/enemyPirate.png');
    this.load.image('enemyMonkey', './assets/gameWorld/monkey.png');
    this.load.image('enemyCrab', './assets/gameWorld/Crab_Small.png');
    this.load.image('enemySnake', './assets/gameWorld/enemySnake.png')

    //background images
    this.load.image('grandpaBox', './assets/gameWorld/grandpaBox.png');
    this.load.image('grandpaPic', './assets/gameWorld/grandpaPic.png');
    this.load.image('door', './assets/gameWorld/Door.png');

    //load bullets and weapons
    this.load.image('bullet', './assets/sprites/bulletSmall.png');
    this.load.image('coconut', './assets/gameworld/coconut_small.png');


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
    this.powerupSound = this.sound.add('powerupAudio');
    this.powerupSound.setRate(1.5);
    this.screamSound = this.sound.add('screamAudio');
    this.peggyScream = this.sound.add('peggyScream');
    this.gameMusic = this.sound.add('gameAudio');
    this.gameMusic.volume = 0.3;
    this.gameMusic.setLoop(true);
    //this.gameMusic.play();

    //add backgrounds to the game


    //bottom level layer
    this.jungleBackground1 = this.add.sprite(320, 2048, 'jungle');
    this.jungleBackground1.setScale(5);
    this.jungleBackground2 = this.add.sprite(960, 2048, 'jungle');
    this.jungleBackground2.setScale(5);
    this.jungleBackground3 = this.add.sprite(1600, 2048, 'jungle');
    this.jungleBackground3.setScale(5);
    this.jungleBackground4 = this.add.sprite(2240, 2048, 'jungle');
    this.jungleBackground4.setScale(5);
    this.jungleBackground5 = this.add.sprite(2880, 2048, 'jungle');
    this.jungleBackground5.setScale(5);
    this.jungleBackground6 = this.add.sprite(3520, 2048, 'jungle');
    this.jungleBackground6.setScale(5);
    this.jungleBackground7 = this.add.sprite(4160, 2048, 'jungle');
    this.jungleBackground7.setScale(5);

    //second layer
    this.jungleBackground8 = this.add.sprite(4160, 1632, 'jungle');
    this.jungleBackground8.setScale(5);
    this.jungleBackground9 = this.add.sprite(4160, 1312, 'jungle');
    this.jungleBackground9.setScale(5);
    this.jungleBackground10 = this.add.sprite(3520, 1408, 'jungle');
    this.jungleBackground10.setScale(5);
    this.jungleBackground11 = this.add.sprite(2880, 1408, 'jungle');
    this.jungleBackground11.setScale(5);
    this.jungleBackground12 = this.add.sprite(2240, 1408, 'jungle');
    this.jungleBackground12.setScale(5);
    this.jungleBackground13 = this.add.sprite(1600, 1408, 'jungle');
    this.jungleBackground13.setScale(5);
    this.jungleBackground14 = this.add.sprite(960, 1408, 'jungle');
    this.jungleBackground14.setScale(5);
    this.jungleBackground15 = this.add.sprite(320, 1408, 'jungle');
    this.jungleBackground15.setScale(5);

    //third layer
    this.skyBackground1 = this.add.sprite(750, 492, 'sky');
    this.skyBackground1.setScale(6);
    this.skyBackground2 = this.add.sprite(2250, 492, 'sky');
    this.skyBackground2.setScale(6);
    this.skyBackground3 = this.add.sprite(3750, 492, 'sky');
    this.skyBackground3.setScale(6);
    this.skyBackground4 = this.add.sprite(5250, 492, 'sky');
    this.skyBackground4.setScale(6);




    this.wallPaper = this.add.sprite(128, 2280, 'wallPaper');
    this.wallPaper.setScale(3.5);
    this.wallPaper4 = this.add.sprite(630, 2280, 'wallPaper');
    this.wallPaper4.setScale(3.5);
    this.wallPaper2 = this.add.sprite(352, 2280, 'wallPaper');
    this.wallPaper2.setScale(3.5);
    this.wallPaper3 = this.add.sprite(576, 2280, 'wallPaper');
    this.wallPaper3.setScale(3.5);



    // adding any textboxes throughout the level as needed
    //text is displaced -84, -50 from the box
    this.textbox1 = this.add.sprite(128, 2240, 'textBorder');
    this.textbox1.setScale(4);
    this.text1 = this.add.text(44, 2190, "Use [W] to jump.\nPress [S] \nto fastfall.\nUse [A] and [D] \nto move \nleft and right.", {font: "18px Lucida Console"});

    this.textbox2 = this.add.sprite(352, 2240, 'textBorder');
    this.textbox2.setScale(4);
    this.text2 = this.add.text(268, 2190, "Use [O] to shoot \nyour grandpa's \ntrusty old gun.\n\nBang!",  {font: "18px Lucida Console"});

    this.textbox3 = this.add.sprite(576, 2240, 'textBorder');
    this.textbox3.setScale(4);
    this.text3 = this.add.text(492, 2190, "Acquire new \nequipment to \nprepare for the \nfight with \nthe pirate king.",  {font: "18px Lucida Console"});

    this.textbox4 = this.add.sprite(2784, 2208, 'textBorder');
    this.textbox4.setScale(4);
    this.text4 = this.add.text(2700, 2158, "Collect the \nBoots of Hermes \nand double jump \nto the tall \nplatform.",  {font: "18px Lucida Console"});

    this.textbox5 = this.add.sprite(3072, 1984, 'textBorder');
    this.textbox5.setScale(4);
    this.text5 = this.add.text(2988, 1934, "Press [A] or [D] \nwith [P] \nto dash\nto quickly \nusing your \nboots.",  {font: "18px Lucida Console"});

    this.textbox6 = this.add.sprite(3264, 1984, 'textBorder');
    this.textbox6.setScale(4);
    this.text6 = this.add.text(3180, 1934, "Use your new \nboots to monkey \nyour way through \nthe jungle!",  {font: "18px Lucida Console"});

    this.textbox7 = this.add.sprite(96, 992, 'textBorder');
    this.textbox7.setScale(4);
    this.text7 = this.add.text(12, 942, "You found \nthe shield. \nPress \n[S] and [P] \nto pull out \nthe shield.",  {font: "18px Lucida Console"});

    //add random decorative/background objects
    this.grandpaBox = this.add.sprite(60, 2350, 'grandpaBox');
    this.grandpaPic = this.add.sprite(60, 2318, 'grandpaPic');
    this.grandpaPic.flipX = true;
    this.houseDoor = this.add.sprite(760, 2338, 'door');
    this.houseDoor.flipX = false;
    this.houseDoor.setScale(4);
    this.pirateShip = this.physics.add.sprite(4432, 702, 'pirateShip');
    this.pirateShip.setScale(3);



    //create the player and add them to the scene
    //112, 2344
    this.player = this.physics.add.sprite(112, 2344, 'peggy');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);
    this.player.flipX = true;

    //create the game world and set the camera to follow the player
    this.physics.world.setBounds(0, 0, 4480, 2400);
    this.cameras.main.setBounds(0, 0, 4480, 2400);
    this.cameras.main.startFollow(this.player);

    //create the game world by adding each tileset using the
    //tilemap and creating collision with the player
    const world = this.make.tilemap({ key: 'gameWorld' });


    var tempTile = world.addTilesetImage('tempTile', 'tempTile');
    const platforms = world.createStaticLayer('tempTile', tempTile, 0, 0);
    platforms.setCollisionByExclusion(-1, true);



    var jungleTile = world.addTilesetImage('jungleTileSheet', 'jungleTileSheet');
    const platforms2 = world.createStaticLayer('jungleTile', jungleTile, 0, 0);
    platforms2.setCollisionByExclusion(-1, true);

    var beachTile = world.addTilesetImage('shipAndBeachTile', 'beachTileSheet');
    const platforms3 = world.createStaticLayer('beachTile', beachTile, 0 ,0);
    platforms3.setCollisionByExclusion(-1, true);

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, platforms2);
    this.physics.add.collider(this.player, platforms3);
    //adding ship collider with player colliders
    this.physics.add.collider(this.pirateShip, platforms3);


    //adding enemy sprites to the gameWorld
    this.enemyGroup = this.physics.add.group({});

    //pirate enemies
    this.pirate1 = this.physics.add.sprite(1360, 2080, 'enemyPirate');
    this.pirate1.setScale(3);
    this.pirate1.flipX = true;
    this.enemyGroup.add(this.pirate1);
    this.pirate2 = this.physics.add.sprite(1264, 704, 'enemyPirate');
    this.pirate2.setScale(3);
    this.enemyGroup.add(this.pirate2);
    this.pirate3 = this.physics.add.sprite(1488, 672, 'enemyPirate');
    this.pirate3.setScale(3);
    this.enemyGroup.add(this.pirate3);
    this.pirate4 = this.physics.add.sprite(1712, 704, 'enemyPirate');
    this.pirate4.setScale(3);
    this.enemyGroup.add(this.pirate4);
    this.pirate12 = this.physics.add.sprite(2032, 672, 'enemyPirate');
    this.pirate12.setScale(3);
    this.enemyGroup.add(this.pirate12);
    this.pirate5 = this.physics.add.sprite(2224, 672, 'enemyPirate');
    this.pirate5.setScale(3);
    this.enemyGroup.add(this.pirate5);
    this.pirate6 = this.physics.add.sprite(2416, 576, 'enemyPirate');
    this.pirate6.setScale(3);
    this.enemyGroup.add(this.pirate6);
    this.pirate7 = this.physics.add.sprite(2640, 704, 'enemyPirate');
    this.pirate7.setScale(3);
    this.enemyGroup.add(this.pirate7);
    this.pirate8 = this.physics.add.sprite(2944, 640, 'enemyPirate');
    this.pirate8.setScale(3);
    this.enemyGroup.add(this.pirate8);
    this.pirate9 = this.physics.add.sprite(2820, 736, 'enemyPirate');
    this.pirate9.setScale(3);
    this.pirate9.flipX = true;
    this.enemyGroup.add(this.pirate9);
    this.pirate10 = this.physics.add.sprite(3376, 704, 'enemyPirate');
    this.pirate10.setScale(3);
    this.enemyGroup.add(this.pirate10);
    this.pirate11 = this.physics.add.sprite(3552, 608, 'enemyPirate');
    this.pirate11.setScale(3);
    this.enemyGroup.add(this.pirate11);

    //monkey enemies
    this.monkey1 = this.physics.add.sprite(2256, 2240, 'enemyMonkey');
    this.enemyGroup.add(this.monkey1);
    this.monkey2 = this.physics.add.sprite(3728, 2016, 'enemyMonkey');
    this.enemyGroup.add(this.monkey2);
    this.monkey3 = this.physics.add.sprite(4464, 2048, 'enemyMonkey');
    this.enemyGroup.add(this.monkey3);
    this.monkey4 = this.physics.add.sprite(3248, 1504, 'enemyMonkey');
    this.enemyGroup.add(this.monkey4);
    this.monkey5 = this.physics.add.sprite(2752, 1600, 'enemyMonkey');
    this.enemyGroup.add(this.monkey5);
    this.monkey6 = this.physics.add.sprite(1760, 1472, 'enemyMonkey');
    this.enemyGroup.add(this.monkey6);
    this.monkey7 = this.physics.add.sprite(528, 1600, 'enemyMonkey');
    this.enemyGroup.add(this.monkey7);
    this.monkey8 = this.physics.add.sprite(1136, 1472, 'enemyMonkey');
    this.enemyGroup.add(this.monkey8);


    //crab enemies
    this.crab1 = this.physics.add.sprite(1456, 736, 'enemyCrab');
    this.enemyGroup.add(this.crab1);
    this.crab2 = this.physics.add.sprite(2000, 736, 'enemyCrab');
    this.enemyGroup.add(this.crab2);
    this.crab3 = this.physics.add.sprite(2192, 736, 'enemyCrab');
    this.enemyGroup.add(this.crab3);
    this.crab4 = this.physics.add.sprite(2602, 736, 'enemyCrab');
    this.enemyGroup.add(this.crab4);
    this.crab5 = this.physics.add.sprite(3136, 512, 'enemyCrab');
    this.enemyGroup.add(this.crab5);

    //snake enemies
    this.snake1 = this.physics.add.sprite(3072, 1696, 'enemySnake');
    this.snake1.flipX = false;
    this.snake1.setScale(3);
    this.enemyGroup.add(this.snake1);
    this.snake2 = this.physics.add.sprite(2512, 1696, 'enemySnake');
    this.snake2.flipX = false;
    this.snake2.setScale(3);
    this.enemyGroup.add(this.snake2);
    this.snake3 = this.physics.add.sprite(2272, 1696, 'enemySnake');
    this.snake3.setScale(3);
    this.snake3.flipX = true;
    this.enemyGroup.add(this.snake3);
    this.snake8 = this.physics.add.sprite(2320, 1696, 'enemySnake');
    this.snake8.flipX = false;
    this.snake8.setScale(3);
    this.enemyGroup.add(this.snake8);
    this.snake4 = this.physics.add.sprite(1376, 1696, 'enemySnake');
    this.snake4.flipX = false;
    this.snake4.setScale(3);
    this.enemyGroup.add(this.snake4);
    this.snake5 = this.physics.add.sprite(1024, 1696, 'enemySnake');
    this.snake5.flipX = false;
    this.snake5.setScale(3);
    this.enemyGroup.add(this.snake5);
    this.snake6 = this.physics.add.sprite(384, 1696, 'enemySnake');
    this.snake6.flipX = false;
    this.snake6.setScale(3);
    this.enemyGroup.add(this.snake6);
    this.snake7 = this.physics.add.sprite(704, 1696, 'enemySnake');
    this.snake7.flipX = false;
    this.snake7.setScale(3);
    this.enemyGroup.add(this.snake7);

    this.physics.add.collider(this.enemyGroup, platforms2);
    this.physics.add.collider(this.enemyGroup, platforms3);

    //player gets damaged with enemy collision
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


    //add player's bullets and shield
    // Max 5 at once
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });

    this.physics.add.collider(this.bullets, platforms, this.hitWall, null, this);
    this.physics.add.collider(this.bullets, platforms2, this.hitWall, null, this);
    this.physics.add.collider(this.bullets, platforms3, this.hitWall, null, this);

    //adding undefined object to be placeholder for shield
    this.shine;

    //add enemy bullets or coconuts
    //add enemy's bullet group
    this.enemyBullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 100
    });
    //add enemy's coconut group
    this.enemyCoconuts = this.physics.add.group({
      defaultKey: "coconut",
      maxSize: 100
    });

    //add treasure chests to game
    this.treasures = this.physics.add.group({});

    this.treasureBoots = this.physics.add.sprite(2784, 2336, 'boots');
    this.treasures.add(this.treasureBoots);

    this.treasureShield = this.physics.add.sprite(96, 1216, 'shine');
    this.treasures.add(this.treasureShield);

    this.physics.add.collider(this.treasures, platforms);
    this.physics.add.collider(this.treasures, platforms2);
    this.physics.add.collider(this.treasures, platforms3);

    //player interactions with treasures
    this.physics.add.overlap(this.player, this.treasureBoots, this.getBoots, null, this);
    this.physics.add.overlap(this.player, this.treasureShield, this.getShield, null, this);
    //player interactions with ship
    this.physics.add.collider(this.pirateShip, platforms);
    this.physics.add.overlap(this.player, this.pirateShip, this.bossFight, null, this);

    //ANIMATIONS

    //Peggy's animations
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers('peggy', {start: this.spriteValue + 1, end: this.spriteValue + 5}),
      frameRate: 10,
      repeat: -1 //repeat forever
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


    //Enemy Movement via tweens
    //Pirates
    this.add.tween({
      targets: this.pirate1,
      x: '+=200',
      ease: "Linear",
      delay: 0,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.add.tween({
      targets: this.pirate2,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      onRepeat: function(){this.enemyShoot(this.pirate2, this.enemyBullets, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.pirate3,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      onRepeat: function(){this.enemyShoot(this.pirate3, this.enemyBullets, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.pirate4,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      onRepeat: function(){this.enemyShoot(this.pirate4, this.enemyBullets, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.pirate5,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      onRepeat: function(){this.enemyShoot(this.pirate5, this.enemyBullets, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.pirate6,
      ease: "Linear",
      x: '-=0',
      delay: 500,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.pirate6, this.enemyBullets, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.pirate7,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      onRepeat: function(){this.enemyShoot(this.pirate7, this.enemyBullets, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.pirate8,
      ease: "Linear",
      x: '-=0',
      delay: 500,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.pirate8, this.enemyBullets, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.pirate9,
      x: '+=384d',
      ease: "Linear",
      delay: 0,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      flipX: true
    });;
    this.add.tween({
      targets: this.pirate10,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      onRepeat: function(){this.enemyShoot(this.pirate10, this.enemyBullets, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.pirate11,
      ease: "Linear",
      x: '-=0',
      delay: 1000,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.pirate11, this.enemyBullets, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.pirate12,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      onRepeat: function(){this.enemyShoot(this.pirate12, this.enemyBullets, this.player)},
     onRepeatScope: this
    });

    //Monkeys
    this.add.tween({
      targets: this.monkey1,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      onRepeat: function(){this.enemyShoot(this.monkey1, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.monkey2,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.monkey2, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.monkey3,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.monkey3, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.monkey4,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.monkey4, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.monkey5,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.monkey5, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.monkey6,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.monkey6, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.monkey7,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.monkey7, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });
    this.add.tween({
      targets: this.monkey8,
      x: '-=0',
      ease: "Linear",
      delay: 2000,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      flipX: true,
      onRepeat: function(){this.enemyShootTargeted(this.monkey8, this.enemyCoconuts, this.player)},
     onRepeatScope: this
    });

    //Snakes
    this.tweens.add({
      targets: this.snake1,
      x: '+=312',
      ease: "Linear",
      duration: 2000,
      repeatDelay: 500,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.tweens.add({
      targets: this.snake2,
      x: '+=176',
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.tweens.add({
      targets: this.snake3,
      x: '-=80',
      ease: "Linear",
      duration: 500,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.tweens.add({
      targets: this.snake8,
      x: '+=90',
      ease: "Linear",
      duration: 500,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.tweens.add({
      targets: this.snake4,
      x: '+=540',
      ease: "Linear",
      duration: 3000,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.tweens.add({
      targets: this.snake5,
      x: '+=540',
      ease: "Linear",
      duration: 3000,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.tweens.add({
      targets: this.snake6,
      x: '+=540',
      ease: "Linear",
      duration: 3000,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.tweens.add({
      targets: this.snake7,
      x: '+=540',
      ease: "Linear",
      duration: 3000,
      yoyo: true,
      repeat: -1,
      flipX: true
    });

    //Crabs
    this.add.tween({
      targets: this.crab1,
      x: '-=160',
      ease: "Linear",
      duration: 2000,
      repeatDelay: 500,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.add.tween({
      targets: this.crab2,
      x: '-=256',
      ease: "Linear",
      duration: 2000,
      repeatDelay: 250,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.add.tween({
      targets: this.crab3,
      x: '-=132',
      ease: "Linear",
      duration: 1000,
      repeatDelay: 500,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.add.tween({
      targets: this.crab4,
      x: '-=300',
      ease: "Linear",
      duration: 2000,
      repeatDelay: 500,
      yoyo: true,
      repeat: -1,
      flipX: true
    });
    this.add.tween({
      targets: this.crab5,
      x: '-=288',
      ease: "Linear",
      duration: 2000,
      repeatDelay: 500,
      yoyo: true,
      repeat: -1,
      flipX: true
    });

    // Display player health bar based on health score
    this.healthbar = this.physics.add.sprite(this.cameras.main.x+20, this.cameras.main.y+58, "health");
    this.healthbar.setScale(2);
    this.healthbar.body.setAllowGravity(false);
    // Move as the camera moves
    this.healthbar.setScrollFactor(0,0);
    //animation that decreses the health bar as you take damage
    this.anims.create({
      key: "healthActive",
      frames: this.anims.generateFrameNumbers("health", {start: this.gameHealth, end: this.gameHealth}),
      frameRate: 0,
      repeat: 1
    });


  }//END OF CREATE FUNCTION

  // Update the scene
  update (time, delta) {
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
      this.mobile = false;
      this.jumpCount = 0;
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
    //enemy coconuts injure player
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
          this.physics.add.overlap(
            b,
            this.shine,
            this.hitShield,
            null,
            this
            );
          //refresh bullet groupe
          //enemy coconuts despawn when they fall off the map
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

  //triggers when player hits an enemy
  hitEnemy(bullet, enemy){
      console.log('hit');
      enemy.disableBody(true, true);
      bullet.disableBody(true, true);
      //play hurt sound
      var randomSpeed = (Math.random()*0.4)+0.5;
      this.screamSound.setRate(randomSpeed);
      this.screamSound.play();
    }
  //triggers when player hits a wall
  hitWall(bullet, wall){
    if (bullet.active) {
        bullet.disableBody(true, true);
    }
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
      if(distanceY < 200 && distanceY > -200){
        if(distance < 450 && distance > -450){ //only fire is enemy active and certain distance
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
  //triggers when player is hit by an enemy with a projectile
  hitPlayer(bullet, player){
    bullet.disableBody(true, true);
    this.peggyScream.play();
    this.healthHurt();
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
  //gain boots from the treasure chest
  getBoots(){
    this.treasureBoots.disableBody(true, true);
    this.powerupSound.play();
    this.bootsObtained = true;
    this.spriteValue += 8;
    this.anims.remove('walk');
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers('peggy', {start: this.spriteValue + 1, end: this.spriteValue + 5}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.remove('idle');
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers('peggy', {start:this.spriteValue, end:this.spriteValue}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.remove('hurt');
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
  }
  //gain shield from the treasure chests
  getShield(){
    this.treasureShield.disableBody(true, true);
    this.powerupSound.play;
    this.shieldObtained = true;
  }
  //when bullet hits shield
  hitShield(bullet, shield){
      bullet.disableBody(true, true);  
  }
  //called after time for the players dash move to complete
  dashFinish(){
    this.player.setVelocityX(0);
    this.player.body.setAllowGravity(true);
    this.player.body.acceleration.x = 0;
  }
  //move onto the bossfight
  bossFight(){
    this.gameMusic.stop();
    this.scene.start('bossIntroScene', {health: this.gameHealth, lives: 3});
  }
  //end game, goes to game over scene
  gameOver(){
    // Stop music if playing
    this.gameMusic.stop();
    console.log('game over!');
    this.scene.start('GameOver');
  }



}
