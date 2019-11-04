export { addSceneEventListeners };

function addSceneEventListeners(that, intScene){
  if (intScene == 0){
    that.input.keyboard.on(
      "keydown_ENTER",
        function(){
          if(that.bootMusic){
            that.bootMusic.stop();
          }
          that.scene.start('IntroScene') //changes from start screen to cutscene
        }
      );
  }

  // If in Intro scene
  else if (intScene == 1){
    // Check if Escape is keyPressed
    that.input.keyboard.on(
      "keydown_ESC",
        function(){
          if (!that.toNextScene){
            if(that.introMusic){
              that.introMusic.stop();
            }
            that.toNextScene = true;
            if(that.introMusic){
              that.introMusic.stop();
            }
            that.scene.start('Level1v2'); //changes from start screen to cutscene

          }
        }
      );

      // Check if Escape is keyPressed
      that.input.keyboard.on(
        "keydown_RIGHT",
          function(){
            if (that.typingIsDone){
              that.currentLetter = 0;
              that.currentPhrase += 1;
              that.typingIsDone = false;
              that.animationStarted = false;
            }
          }
        );
  }


}
