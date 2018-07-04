import * as THREE from '../libs/three'

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

        this.lookAt = new THREE.Vector3()
    }

    resume () {
        if (this.loaded) {
            return this.showStarryRiver()
        }

        viewState.splashing = true

        this.sn.camera.position.x = 0
        this.sn.camera.position.y = 50
        this.sn.camera.position.z = 50

        this.lookAt.x = 0
        this.lookAt.y = 50
        this.lookAt.z = 0

        this.sn.camera.lookAt(this.lookAt)
    }

    showStarryRiver () {

    }
}
