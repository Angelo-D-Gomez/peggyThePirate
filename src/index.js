/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
import Level1 from './scenes/Level1.js';
import Boss1 from './scenes/Boss1.js'
import successScene from './scenes/successScene.js';
import GameOver from './scenes/GameOverScene.js'
import Config from './config/config.js';
import Level1v2 from './scenes/Level1.1.js';


class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Level1', Level1);
    this.scene.add('Level1v2', Level1v2);
    this.scene.add('GameOver', GameOver);
    this.scene.add('successScene', successScene);
    this.scene.add('Boss1', Boss1);
    this.scene.start('Boot');
  }
  }

window.game = new Game();
