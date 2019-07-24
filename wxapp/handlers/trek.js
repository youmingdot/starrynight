import Toucher from '../game/toucher'
import Handler from 'handler'

import SummaryHandler from '../handlers/summary'

import StarrySprite from '../sprites/starry'

class TrekToucher extends Toucher {

    initialize () {
        let panOptions = {
            threshold: 0
        }

        this.dolly = false

        this.hammer.on('panstart', this.onPanStart.bind(this), panOptions)
        this.hammer.on('panmove', this.onPanMove.bind(this), panOptions)
        this.hammer.on('panend', this.onPanEnd.bind(this), panOptions)

        this.hammer.on('tap', this.onTap.bind(this))
    }

    onPanStart (event) {
        this.handler.starry.controls.onTouchStart(event)
    }

    onPanMove (event) {
        this.handler.starry.controls.onTouchMove(event)
    }

    onPanEnd (event) {
        this.handler.starry.controls.onTouchEnd(event)
    }

    onTap (event) {
        if (event.tapCount === 2) {
            return this.onDoubleTap(event)
        }
    }

    onDoubleTap (event) {
        // if (this.dolly) {
        //     this.handler.starry.controls.dollyOut(10)
        // } else {
        //     this.handler.starry.controls.dollyIn(10)
        // }
        //
        // this.dolly = !this.dolly
    }
}

export default class TrekHandler extends Handler {

    initialize () {
        this.toucher = new TrekToucher(this)

        this.starry = new StarrySprite(this.sn)

        this.sn.sprites.starry = this.starry
    }

    pause () {
        super.pause()

        this.toucher.pause()
    }

    resume () {
        super.resume()

        this.toucher.resume()
    }

    showMovie (movieId) {
        let handler = new SummaryHandler(this.sn)

        handler.setTrekHandler(this)

        handler.showMovie(movieId)

        this.sn.setHandler(handler)
    }
}
