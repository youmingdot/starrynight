import Toucher from '../game/toucher'
import Handler from 'handler'

import ViewState from '../states/view'
import * as THREE from "../libs/three";

let viewState = new ViewState()

class SplashToucher extends Toucher {

    initialize () {

    }

}

export default class SplashHandler extends Handler {

    initialize () {
        super.initialize()

        this.toucher = new SplashToucher(this)

        this.loaded = false

        this.lookAt = new THREE.Vector3()
    }

    resume () {
        super.resume()

        if (this.loaded) {
            return this.showStarryRiver()
        }

        viewState.splashing = true

        this.sn.camera.position.x = 0
        this.sn.camera.position.y = 0
        this.sn.camera.position.z = 0

        this.lookAt.x = 0
        this.lookAt.y = 2000
        this.lookAt.z = 0

        this.sn.camera.lookAt(this.lookAt)
    }

    showStarryRiver () {

    }
}
