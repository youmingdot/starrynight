import Hammer from '../libs/hammer'

export default class Toucher {

    constructor (handler) {
        this.handler = handler
        this.sn = handler.sn

        this.hammer = new Hammer(this.sn.canvas, {
            enable: this.isEffecting.bind(this)
        })

        let pinch = new Hammer.Pinch({ event: 'pinch' })
        let pan = new Hammer.Pan({ event: 'pan' })
        let singleTap = new Hammer.Tap({ event: 'tap' })
        let doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 })

        this.hammer.add([pinch, pan, singleTap, doubleTap])

        doubleTap.recognizeWith(singleTap)
        singleTap.requireFailure(doubleTap)

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
