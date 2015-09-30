// modified from https://github.com/drhayes/impactjs-statemachine
var StateMachine = function( entity, opts ) {
  this.unnamedTransitionCounter = 0;

  this.entity = entity;
  this.opts = opts || {};

  this.states = {};
  this.transitions = {};
  // Track states by name.
  this.initialState = null;
  this.currentState = null;
  this.previousState = null;
  this.timer = null;
  
  this.state = function(name, definition) {
    if (!definition) {
      return this.states[name];
    }
    this.states[name] = definition;
    if (!this.initialState) {
      this.initialState = name;
    }
  };

  this.transition = function(name, fromState, toState, predicate) {
    if (!fromState && !toState && !predicate) {
      return this.transitions[name];
    }
    // Transitions don't require names.
    if (!predicate) {
      predicate = toState;
      toState = fromState;
      fromState = name;
      name = 'transition-' + this.unnamedTransitionCounter;
      this.unnamedTransitionCounter += 1;
    }
    if (!this.states[fromState]) {
      throw new Error('Missing from state: ' + fromState);
    }
    if (!this.states[toState]) {
      throw new Error('Missing to state: ' + toState);
    }
    var transition = {
      name: name,
      fromState: fromState,
      toState: toState,
      predicate: predicate
    };
    this.transitions[name] = transition;
    return transition;
  };

  this.update = function() {
    if (!this.currentState) {
      this.currentState = this.initialState;
    }
    var state = this.state(this.currentState);

    if (this.previousState !== this.currentState) {
      if( this.lastTransition ){
        this.entity.animations.play( this.lastTransition.name );
        if( this.opts.debug ){
          console.log("Play transitional animation: " + this.lastTransition.name );
        }
      }
    
      if (state.enter) {
        this.timer = new Date();
        state.enter( this.lastTransition );
      }
      this.previousState = this.currentState;
    }
    
    // Verify the transitional animation has completed before entering update()
    if( this.lastTransition && 
        ( this.entity.animations.currentAnim.name == this.lastTransition.name && this.entity.animations.currentAnim.isPlaying ) ){
      return;
    }

    if( this.entity.animations.currentAnim.name != this.currentState ){
      if( this.opts.debug ){
        console.log("Play animation: " + this.currentState );
      }
      this.entity.animations.play( this.currentState );
    }
    
    if (state.update) {
      state.update();
    }
    // Iterate through transitions.
    for (var name in this.transitions) {
      var transition = this.transitions[name];
      if (transition.fromState === this.currentState &&
          transition.predicate()) {
        this.lastTransition = transition;
        if (state.exit) {
          state.exit();
        }
        this.currentState = transition.toState;
        return;
      }
    }
  };
};