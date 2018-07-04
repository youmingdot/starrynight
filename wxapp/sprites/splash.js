import * as THREE from '../libs/three'

import ViewState from '../states/view'

import Sprite from 'sprite'

let viewState = new ViewState()

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()

        this.ambientLight = new THREE.AmbientLight(0xFFFFFF)


    }

    show () {
        this.sn.scene.add(this.ambientLight)
    }

    hide () {
        this.sn.scene.remove(this.ambientLight)
    }

    update () {
        this.setVisible(viewState.splashing)
    }


}
