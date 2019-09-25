/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
import Level1 from './scenes/Level1.js';
import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Level1', Level1);
    this.scene.start('Level1');
  }
}

window.game = new Game();
