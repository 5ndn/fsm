var should = require('chai').should();

//import {StateManager,State} from '../index';
import StateManager from '../src/StateManager';
import State from '../src/State';

describe('StateManager', function() {

    var sm = new StateManager({foo:"bar"});

    it('creates instance', function(){

        sm._context.should.have.property('foo');
    });

    it('should add state', function(){

        sm.addState('init', new State, true);

        sm.currentKey.should.equal('init');
    });

    it('should change state', function(){

        sm.addState('next', new State );

        sm.setState('next');

        sm.currentKey.should.equal('next');
    });

    it('state has context', function(){

        sm.currentState.context.should.have.property('foo');
    });
})
