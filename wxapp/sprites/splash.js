import * as THREE from '../libs/three'

import Sprite from 'sprite'

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()



        let plane = new THREE.Mesh(new THREE.PlaneGeometry(60, 20, 1, 1), new THREE.MeshBasicMaterial({color: 0xcccccc}))

        plane.rotation.x = -0.5 * Math.PI
        plane.position.x = 15
        plane.position.y = 0
        plane.position.z = 0

        this.way = 0.2

        this.sn.scene.add(plane)

        this.plane = plane

        this.sn.scene.add(new THREE.AmbientLight(0xFFFFFF))
    }

    update () {

    }
}
