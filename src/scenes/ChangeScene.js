export { addSceneEventListeners };

function addSceneEventListeners(that){
  that.input.keyboard.on(
    "keydown_ENTER",
      function(){
        if(that.bootMusic){
          that.bootMusic.stop();
        }
        that.scene.start('Level1v2') //changes from start screen to cutscene
      }
    );
}
