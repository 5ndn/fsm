# 5NDN FSM ![](https://api.travis-ci.org/5ndn/fsm.svg?branch=master)

A Flexible Finite State Machine for Javascript.

## Installation



```sh
npm install 5ndn-fsm
```

## Basic Usage

Create an instance

```javascript
var stateMachine = new StateMachine(this);
```

Create some states

```javascript
var RedState = new State();
var BlueState = new State();
```

Add them to the Manager

```javascript
//pass true to initialize
stateManager.addState( 'red', RedState, true );
stateManager.addState( 'blue', BlueState );
```

Change States

```javascript
stateManager.setState('blue');
```
## Real Usage

You'll usually want to extend the *State* class.  The real magic happens inside of the methods you can override.

### CREATING OUR STATES
Create your class and extend State

```javascript
import {State} from '5ndn-fsm';

class RedState extend State{

	constructor(){
		super();
	}
	
	get KEY(){
		return "Red State";
	}
	
	doIntro(){
		
		// This is where your animation happen
	
		// When they're done! Don't forget to call the super method
		super.doIntro();
	}
	
	action(){
		
		// Use the context to change anything you need
		this.context.color = "red"
		
		// This is called right after doIntro is completed
	}
	
	doOutro(){
	
		// This is more animations happen
		
		// Again, do forget to call the super method
		super.doOutro();
	}
}
```
The getter "KEY" is there for is you want to pass only the State Class into the *addState* method.  It's important to always call tho super methods to let the manager know where you're at.  If you forget, the manager we'll let you know.  The *action* method is the only one that doesn't have anything to call.

```javascript
import {State} from '5ndn-fsm';

class RedState extend State{

	constructor(){
		super();
	}
	
	get KEY(){
		return 'Blue State';
	}
	
	doIntro(){
		
		// This is where your animation happen
	
		// When they're done! Don't forget to call the super method
		super.doIntro();
	}
	
	action(){
		
		// This being the blue state
		this.context.color = "blue";
		
		// This is called right after doIntro is completed
	}
	
	doOutro(){
	
		// This is more animations happen
		
		// Again, do forget to call the super method
		super.doOutro();
	}
}
```
In both State classes above, we've changed the color in the *action* methods.

### CREATING OUR MANAGER

Since we used the *getter* method *KEY* we can just pass the Class functions.  ( looks pretty that way )

```javascript
import {StateManager} from '5ndn-fsm';

class MyContext{

	constructor(){
		
		this.color = "white";
		
		this.stateManager = new StateManager( this );
		this.stateManager.addState( RedState, true );
		this.stateManager.addState( BlueState );
	}
```

### CHANGE STATES AND LISTENING FOR CHANGES

Knowing when your changes are done can be quit powerful.  You can listen to this changes via the event emmtter.  Thanks Miller Medeiros and Robert Penner https://millermedeiros.github.io/js-signals/

```javascript

this.stateManager.action.add( function(key){ console.log(key) } );
this.stateManager.introStart.add( function(key){ console.log(key) } );
this.stateManager.outroStart.add( function(key){ console.log(key) } );
this.stateManager.introComplete.add( function(key){ console.log(key) } );
this.stateManager.outroComplete.add( function(key){ console.log(key) } );

this.stateManager.setState( BlueState.KEY );

```

Set State also returns a Promise ( if you're into that sort of thing ).  So you can do something like.

```javascript 
this.stateManager.setState( BlueState.KEY ).then( function(){
	// do other stuff
});
```


## Support



## Contributing


