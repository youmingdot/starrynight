import Toucher from '../game/toucher'
import Handler from 'handler'

import SummaryHandler from '../handlers/summary'

import StarrySprite from '../sprites/starry'

class TrekToucher extends Toucher {

    initialize () {
        this.paning = false

        this.lastPanX = this.lastPanY = 0

        let panOptions = {
            threshold: 0
        }

        this.hammer.on('panstart', this.onPanStart.bind(this), panOptions)
        this.hammer.on('panmove', this.onPanMove.bind(this), panOptions)
        this.hammer.on('panend', this.onPanEnd.bind(this), panOptions)

        this.hammer.on('tap', this.onTap.bind(this))
        this.hammer.on('doubletap', this.onDoubleTap.bind(this))
    }

    onPanStart (event) {
        this.paning = true

        this.lastPanX = event.center.x
        this.lastPanY = event.center.y
    }

    onPanMove (event) {
        this.paning = true

        let dX = event.center.x - this.lastPanX
        let dY = event.center.y - this.lastPanY

        this.moveCamera(dX, dY)

        this.lastPanX = event.center.x
        this.lastPanY = event.center.y
    }

    onPanEnd (event) {
        this.paning = false

        let dX = event.center.x - this.lastPanX
        let dY = event.center.y - this.lastPanY

        this.moveCamera(dX, dY)

        this.lastPanX = event.center.x
        this.lastPanY = event.center.y
    }

    onTap (event) {
        console.log(event)
    }

    onDoubleTap (event) {
        console.log(event)
    }

    moveCamera (x, y) {
        this.handler.starry.move(x, y)
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
