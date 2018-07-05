import Toucher from '../game/toucher'
import Handler from 'handler'

import ViewState from '../states/view'

let viewState = new ViewState()

class SplashToucher extends Toucher {

    initialize () {

    }

}

export default class SplashHandler extends Handler {

    initialize () {
        this.toucher = new SplashToucher(this)

        this.loaded = false
    }

    resume () {
        if (this.loaded) {
            return this.showStarryRiver()
        }

        viewState.splashing = true
    }

    showStarryRiver () {

    }
}
