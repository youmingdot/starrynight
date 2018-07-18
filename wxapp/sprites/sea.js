import * as THREE from '../libs/three'

import ViewState from '../states/view'

import Sprite from 'sprite'

let viewState = new ViewState()

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()

        this.loader = new THREE.TextureLoader()

        this.light = new THREE.AmbientLight(0xffffff)

        this.pointTexture = this.loader.load('images/star.png')


    }

    show () {
        this.sn.scene.add(this.light)
    }

    hide () {
        this.sn.scene.remove(this.light)
    }

    update (time) {
        this.setVisible(viewState.treking)


    }

}
