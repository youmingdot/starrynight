import * as THREE from '../libs/three'

import Sprite from 'sprite'

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()

        let axes = new THREE.AxesHelper(20)

        this.scene.add(axes)

        let plane = new THREE.Mesh(new THREE.PlaneGeometry(60, 20, 1, 1), new THREE.MeshBasicMaterial({color: 0xcccccc}))

        plane.rotation.x = -0.5 * Math.PI
        plane.position.x = 15
        plane.position.y = 0
        plane.position.z = 0

        this.way = 0.2

        this.scene.add(plane)

        this.plane = plane

        this.scene.add(new THREE.AmbientLight(0x000000))
    }

    update () {
        this.plane.position.x += this.way

        if (this.plane.position.x > 30) {
            this.way = - 0.2
        } else if (this.plane.position.x < -30) {
            this.way = 0.2
        }
    }

    onTouchMove (pointers, actives) {

    }
}
