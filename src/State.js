import Signals from 'signals/dist/signals';

export default class State
{

    constructor()
    {
        // signals
        this.outroComplete = new Signals();
        this.introComplete = new Signals();

        //this._status = "";
        this._key= "";
        this._context = {};
    }

    doIntro()
    {
        //override
        this.signalIntroComplete();
    }

    action()
    {
        //override
    }

    doOutro()
    {
        //override
        this.signalOutroComplete();
    }

    signalIntroComplete()
    {
        this.introComplete.dispatch();
    }

    signalOutroComplete()
    {
        this.outroComplete.dispatch();
    }

    setContext(context)
    {
        this._context = context;
    }

    setKey( key )
    {
        this._key = key;
    }

    getKey()
    {
        return this._key;
    }

    get context()
    {
        return this._context;
    }
}
