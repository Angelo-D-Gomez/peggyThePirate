export { addSceneEventListeners };

function addSceneEventListeners(that){
  that.input.keyboard.on(
    "keydown_ENTER",
      function(){
        that.scene.start('Level1')
      }
    );
}
