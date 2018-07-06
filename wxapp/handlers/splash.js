import Toucher from '../game/toucher'
import Handler from 'handler'

import ViewState from '../states/view'

let viewState = new ViewState()

class SplashToucher extends Toucher {

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
        this.sn.camera.position.x -= x
        this.sn.camera.position.y -= y
    }

}

export default class SplashHandler extends Handler {

    initialize () {
        this.toucher = new SplashToucher(this)

        this.loaded = false
    }

    resume () {
        super.resume()

        if (this.loaded) {
            return this.showStarryRiver()
        }

        viewState.splashing = true
    }

    showStarryRiver () {

    }
}
