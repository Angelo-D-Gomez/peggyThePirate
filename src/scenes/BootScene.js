/*global Phaser*/
import * as ChangeScene from'./Changescene.js';
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    // add event addSceneEventListeners
    ChangeScene.addSceneEventListeners(this);
    //Create the scene
    var text = this.add.text(this.centerX-150, this.centerY, 'this is the game start screen')
    var text = this.add.text(this.centerX-185, this.centerY + 50, 'press enter to move to first level scene')
  }

  update (time, delta) {
    // Update the scene
  }
}
