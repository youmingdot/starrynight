import Toucher from '../game/toucher'
import Handler from 'handler'

import SplashSprite from '../sprites/splash'

class SplashToucher extends Toucher {

    initialize () {

    }

}

export default class SplashHandler extends Handler {

    initialize () {
        super.initialize()

        this.toucher = new SplashToucher(this)

        this.loaded = false

        this.splash = new SplashSprite(this.sn)

        this.sn.sprites = [
            this.splash
        ]
    }

    resume () {
        super.resume()

        if (this.loaded) {
            return this.showStarryRiver()
        }
    }

    showStarryRiver () {

    }
}
