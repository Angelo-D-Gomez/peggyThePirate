/*global Phaser*/
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Level1');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image("peggy", "./assets/spritesheets/mainCharacter")
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
