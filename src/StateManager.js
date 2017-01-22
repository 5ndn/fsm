import * as Status from './Status';
import Signals from 'signals/dist/signals';

export default class StateManager
{

    constructor( context )
    {
        this.action = new Signals();
        this.introStart = new Signals();
        this.outroStart = new Signals();
        this.introComplete = new Signals();
        this.outroComplete = new Signals();

        this._context = context;
        this._states = {};
        this._status = Status.STANDBY;
        this._resolve = function(){};
        this._reject = function(){};
    }

    addState( key, state, startState = false )
    {
        // pass state class for convinience
        if( typeof key === "function" ){
            if( state === true ) startState = true;
            state = new key();
            key = key.KEY;
        }

        if( this._states[key] == null )
        {
            this._states[key] = state;
            this._states[key].setContext( this._context );
            this._states[key].setKey( key );
            this._states[key].introComplete.add( this.onIntroComplete.bind(this) );
            this._states[key].outroComplete.add( this.onOutroComplete.bind(this) );
        }

        if( startState ) this.initState( key );
    }

    setState( key )
    {
        if( this._states[key] == null )
            throw Error( 'No Such State: '+key );

        //if no state has been set to initialize
        // init new state
        //else change
        if( this._currentState == null )
        {
            return new Promise( (resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;

                this.initState( key );
            })
        }else
        {
            this._newState = this._states[key];

            if( this._status == Status.STANDBY )
                return new Promise( (resolve, reject) => {
                    this._resolve = resolve;
                    this._reject = reject;

                    this.changeState();
                })
        }
    }

    initState( key )
    {
        this._status = Status.INTRO_ACTION;
        this._newState = this._states[key];
        this._currentState = this._newState;
        this.introStart.dispatch( this.currentKey );
        this._newState.doIntro( true ); //pass true to signify it's the initial state
    }

    changeState()
    {
        this._status = Status.OUTRO_ACTION;
        this.outroStart.dispatch( this.currentKey );
        this._currentState.doOutro();
    }

    onIntroComplete( eEvent )
    {
        if( this._status != Status.INTRO_ACTION )
            throw Error( 'You cant dispatch introComplete from the outro method: ' );

        this.introComplete.dispatch( this.currentKey );

        if( this._currentState == this._newState )
        {
            this._currentState.action();
            this._status = Status.STANDBY;
            this.action.dispatch( this.currentKey );
            this._resolve();
        }else
            this.changeState();
    }

    onOutroComplete( eEvent )
    {
        if( this._status != Status.OUTRO_ACTION )
            throw Error( 'You cant dispatch outroComplete from the intro method: ' );

        this.outroComplete.dispatch( this.currentKey );

        this._status = Status.INTRO_ACTION

        this._currentState = this._newState;

        this.introStart.dispatch( this.currentKey );

        this._currentState.doIntro();
    }

    get currentKey()
    {
        return this.currentState.getKey();
    }

    get currentState()
    {
        return this._currentState;
    }
}
