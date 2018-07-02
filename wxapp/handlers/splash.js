import Toucher from '../game/toucher'
import Handler from 'handler'

class SplashToucher extends Toucher {

    initialize () {

    }

}

export default class SplashHandler extends Handler {

    initialize () {
        this.toucher = new SplashToucher(this)
    }



}
