//
// Killian
//

Killian = function( game, x, y ){
  Phaser.Sprite.call(this, game, x, y, 'killian');

  //
  // Animations
  //

  this.animations.add('walking', [1,2,3,4,5,6,7,8,9,10,11,12], 30, true);
  this.animations.add('walking_to_sitting', [13,14,15,16,17,18,19], 40, false);
  
  this.animations.add('sitting', [21,22,23,24,25,26], 35, true);
  this.animations.add('sitting_to_walking', [19,18,17,16,15,14,13], 40, false);
  this.animations.add('sitting_to_laying', [88,89,90,91,92,93,94,95,97,97,97,97], 40, false);
  
  this.animations.add('laying', [97,98,99,98], 10, true);
  this.animations.add('laying_to_sitting', [95,94,93,92,91,90,89,88,87,87,87,87,87,87,87], 40, false);
  this.animations.add('laying_to_sleeping',  [102,103,104,105,106,107,108,109,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110], 40, false);
  
  this.animations.add('sleeping',  [113,114,115,116,117,118,119,120,121,121,121,121,121,121,121,121,121,121,121,120,119,118,117,116,115,114,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113], 10, true );
  this.animations.add('sleeping_to_laying', [113,110,109,108,107,106,105,104,103,102,100,99,98,97,97,97,97,97,97,97], 40, false);

  //
  // State Machine
  //
  
  this.sm = new StateMachine( this, { debug: false } );
  var self = this;
  
  this.sm.state('sitting', {
    enter:  function(){ },
    update: function(){ },
    exit:   function(){ }
  });
  
  this.sm.state('walking', {
    enter:  function(){ },
    update: function(){ },
    exit:   function(){ }
  });
  
  this.sm.state('laying', {
    enter:  function(){ },
    update: function(){ },
    exit:   function(){ }
  });
  
  this.sm.state('sleeping', {
    enter:  function(){ },
    update: function(){ },
    exit:   function(){ }
  });   
  
  //
  // state machine transitions
  //
  
  // walking
  this.sm.transition('walking_to_sitting', 'walking', 'sitting', function(){
    return ( !game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) );
  });
  
  this.sm.transition('sitting_to_walking', 'sitting', 'walking', function(){
    return ( game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) );
  });

  // sitting
  this.sm.transition('sitting_to_laying', 'sitting', 'laying', function(){
    return ( new Date() - self.sm.timer > 1500 );
  });

  // laying
  this.sm.transition('laying_to_sitting', 'laying', 'sitting', function(){
    return ( game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) );
  });

  this.sm.transition('laying_to_sleeping', 'laying', 'sleeping', function(){
    return ( new Date() - self.sm.timer > 1500 );
  });
  
  // sleeping
  this.sm.transition('sleeping_to_laying', 'sleeping', 'laying', function(){
    return ( game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) );
  });
  
  this.animations.play( this.sm.initialState );
      
  game.add.existing(this);
}

Killian.prototype = Object.create(Phaser.Sprite.prototype);
Killian.prototype.constructor = Killian;
Killian.prototype.update = function(){
  this.sm.update();
}