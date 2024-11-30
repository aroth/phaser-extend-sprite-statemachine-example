class Killian extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'killian');

    //
    // Animations
    //

    this.anims.create({
      key: 'walking',
      frames: this.anims.generateFrameNumbers('killian', { start: 1, end: 12 }),
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: 'walking_to_sitting',
      frames: this.anims.generateFrameNumbers('killian', { start: 13, end: 19 }),
      frameRate: 40,
      repeat: 0
    });

    this.anims.create({
      key: 'sitting',
      frames: this.anims.generateFrameNumbers('killian', { start: 21, end: 26 }),
      frameRate: 35,
      repeat: -1
    });

    this.anims.create({
      key: 'sitting_to_walking',
      frames: this.anims.generateFrameNumbers('killian', { start: 19, end: 13 }),
      frameRate: 40,
      repeat: 0
    });

    this.anims.create({
      key: 'sitting_to_laying',
      frames: this.anims.generateFrameNumbers('killian', { start: 88, end: 97 }),
      frameRate: 40,
      repeat: 0
    });

    this.anims.create({
      key: 'laying',
      frames: this.anims.generateFrameNumbers('killian', { start: 97, end: 98 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'laying_to_sitting',
      frames: this.anims.generateFrameNumbers('killian', { start: 95, end: 87 }),
      frameRate: 40,
      repeat: 0
    });

    this.anims.create({
      key: 'laying_to_sleeping',
      frames: this.anims.generateFrameNumbers('killian', { start: 102, end: 110 }),
      frameRate: 40,
      repeat: 0
    });

    this.anims.create({
      key: 'sleeping',
      frames: this.anims.generateFrameNumbers('killian', { start: 113, end: 121 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'sleeping_to_laying',
      frames: this.anims.generateFrameNumbers('killian', { start: 113, end: 97 }),
      frameRate: 40,
      repeat: 0
    });

    //
    // State Machine
    //

    this.sm = new StateMachine(this, { debug: false });
    var self = this;

    this.sm.state('sitting', {
      enter: function () { },
      update: function () { },
      exit: function () { }
    });

    this.sm.state('walking', {
      enter: function () { },
      update: function () { },
      exit: function () { }
    });

    this.sm.state('laying', {
      enter: function () { },
      update: function () { },
      exit: function () { }
    });

    this.sm.state('sleeping', {
      enter: function () { },
      update: function () { },
      exit: function () { }
    });

    //
    // state machine transitions
    //

    // walking
    this.sm.transition('walking_to_sitting', 'walking', 'sitting', function () {
      return (!self.scene.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT));
    });

    this.sm.transition('sitting_to_walking', 'sitting', 'walking', function () {
      return (self.scene.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT));
    });

    // sitting
    this.sm.transition('sitting_to_laying', 'sitting', 'laying', function () {
      return (new Date() - self.sm.timer > 1000);
    });

    // laying
    this.sm.transition('laying_to_sitting', 'laying', 'sitting', function () {
      return (self.scene.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT));
    });

    this.sm.transition('laying_to_sleeping', 'laying', 'sleeping', function () {
      return (new Date() - self.sm.timer > 1000);
    });

    // sleeping
    this.sm.transition('sleeping_to_laying', 'sleeping', 'laying', function () {
      return (self.scene.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT));
    });

    this.anims.play(this.sm.initialState);

    this.scene.add.existing(this);
  }

  update() {
    this.sm.update();
  }
}
