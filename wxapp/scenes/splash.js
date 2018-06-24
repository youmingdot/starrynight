import * as THREE from '../libs/three.js'

import Scene from 'scene'

export default class SplashScene extends Scene {

    /**
     * Create a splash scene instance.
     */
    constructor (sn) {
        super(sn)

        let axes = new THREE.AxesHelper(20)

        this.scene.add(axes)

        let plane = new THREE.Mesh(new THREE.PlaneGeometry(60, 20, 1, 1), new THREE.MeshBasicMaterial({color: 0xcccccc}))

        plane.rotation.x = -0.5 * Math.PI
        plane.position.x = 15
        plane.position.y = 0
        plane.position.z = 0

        this.scene.add(plane)

        this.scene.add(new THREE.AmbientLight(0x000000))

        this.camera.position.x = -30
        this.camera.position.y = 20
        this.camera.position.z = 20

        this.camera.lookAt(this.scene.position)

        // this.renderer.setClearColor(new THREE.Color('0xFFFFFF'))
    }

}
