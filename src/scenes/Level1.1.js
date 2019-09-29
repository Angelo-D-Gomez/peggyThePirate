/*global Phaser*/
export default class Level1.1 extends Phaser.Scene {
  constructor () {
    super('Level1.1');
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

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene

  }

  update (time, delta) {
    // Update the scene
  }
}
