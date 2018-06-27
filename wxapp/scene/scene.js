import * as THREE from '../libs/three.js'

import SplashSprite from '../sprites/splash';

export default class Scene {

    /**
     * Create a scene instance.
     */
    constructor (canvas, width, height) {
        this.canvas = canvas

        this.width = width
        this.height = height

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 2000)

        this.scene.add(this.camera)

        this.renderer = new THREE.WebGLRenderer({ context: canvas.getContext('webgl') })
        this.renderer.setClearColor(0x000000)
        this.renderer.setSize(this.width, this.height)

        this.createSprites()
    }

    createSprites () {
        this.sprites = [
            new SplashSprite(this.scene)
        ]
    }

    /**
     * Look at the point.
     */
    lookAt (x, y, z) {
        this.camera.lookAt(x, y, z)
    }

    /**
     * Update the scene.
     */
    update () {
        this.sprites.forEach(function (sprite) {
            sprite.update()
        })
    }

    /**
     * Render the scene to the screen.
     */
    render () {
        this.renderer.render(this.scene, this.camera)
    }
}
