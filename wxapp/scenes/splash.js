import * as THREE from '../libs/three.js'

import Scene from 'scene'

export default class SplashScene extends Scene {

    /**
     * Create a splash scene instance.
     */
    constructor (sn) {
        super(sn)

        let axes = new THREE.AxisHelper(20)

        this.scene.add(axes)

        let plane = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), THREE.MeshBasicMaterial({color: 0xcccccc}))

        plane.rotation.x = -0.5 * Math.PI
        plane.position.x = 15

        this.scene.add(plane)

        this.renderer.setClearColor(new THREE.Color('0xFFFFFF'))
    }

}
