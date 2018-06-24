import * as THREE from '../libs/three.js'

let context = canvas.getContext('webgl')

export default class Scene {

    /**
     * Create a scene.
     */
    constructor (sn) {
        this.sn = sn

        this.scene = new THREE.Scene()

        this.width = window.innerWidth
        this.height = window.innerHeight
        this.aspect = this.width / this.height

        this.camera = new THREE.PerspectiveCamera(50, this.aspect, 0.1, 2000)

        this.scene.add(this.camera)

        this.renderer = new THREE.WebGLRenderer({ context: context })
        this.renderer.setClearColor(0xEEEEEE)
        this.renderer.setSize(this.width, this.height)

        this.sprites = []
    }

    /**
     * Update the scene.
     */
    update () {}

    /**
     * Render the scene to the screen.
     */
    render () {
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * Finish the scene.
     */
    finish () {
        this.sn.popScene()
    }

    /**
     * Called when touch start.
     */
    onTouchStart (event) {}

    /**
     * Called when touch move.
     */
    onTouchMove (event) {}

    /**
     * Called when touch end.
     */
    onTouchEnd (event) {}

    /**
     * Called when touch cancel.
     */
    onTouchCancel (event) {}
}
