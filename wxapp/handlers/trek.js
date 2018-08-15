import Toucher from '../game/toucher'
import Handler from 'handler'

import SeaSprite from '../sprites/sea'
import StarrySprite from '../sprites/starry'

class TrekToucher extends Toucher {

    initialize () {
        this.paning = false

        this.lastPanX = this.lastPanY = 0

        let panOptions = {
            threshold: 2
        }

        this.hammer.on('panstart', this.onPanStart.bind(this), panOptions)
        this.hammer.on('panmove', this.onPanMove.bind(this), panOptions)
        this.hammer.on('panend', this.onPanEnd.bind(this), panOptions)
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

    moveCamera (x, y) {
        this.handler.starry.move(-x * 0.05, y * 0.05)
    }

}

export default class TrekHandler extends Handler {

    initialize () {
        this.toucher = new TrekToucher(this)

        this.starry = new StarrySprite(this.sn)

        this.sn.sprites = [
            this.starry
        ]
    }

    pause () {
        super.pause()

        this.toucher.pause()
    }

    resume () {
        super.resume()

        this.toucher.resume()
    }

    showStarryRiver () {

    }
}
