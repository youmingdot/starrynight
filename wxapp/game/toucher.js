import Hammer from '../libs/hammer'

export default class Toucher {

    constructor (handler) {
        this.handler = handler
        this.sn = handler.sn

        this.hammer = new Hammer(this.sn.canvas, {
            enable: this.isEffecting.bind(this),
            recognizers: [
                [Hammer.Rotate],
                [Hammer.Pinch],
                [Hammer.Pan],
                [Hammer.Tap],
                [Hammer.Tap, {event: 'doubletap', taps: 2}, ['tap']],
                [Hammer.Press]
            ]
        })

        this.effecting = false

        this.initialize()
    }

    initialize () {
        //
    }

    isEffecting () {
        return this.effecting
    }

    resume () {
        this.effecting = true
    }

    pause () {
        this.effecting = false
    }

}
