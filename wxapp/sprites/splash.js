import * as THREE from '../libs/three'
import TWEEN from '../libs/tween'

import Sprite from 'sprite'

const PARTICLE_AMOUNT = 3600
const PARTICLE_NOISE_SPEED = 0.2

const SAYS_MIN_SHOW_TIME = 3000
const SAYS_PARTICLE_AMOUNT = 36000
const SAYS_IMAGE_DENSITY = 8

const SAYS_IMAGES = [
    {image: 'images/splash-says-1.png', width: 178, height: 35},
    {image: 'images/splash-says-2.png', width: 176, height: 35},
    {image: 'images/splash-says-3.png', width: 142, height: 35},
    {image: 'images/splash-says-4.png', width: 141, height: 35},
    {image: 'images/splash-says-5.png', width: 94, height: 47},
]

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()

        this.createThreeWorld()

		this.scene.add(new THREE.AmbientLight(0xfefefe))

        this.initializeSays()

        this.setVisible(true)

        this.camera.position.set(50, 50, 50)

        this.camera.lookAt(0, 30, 0)

        // this.startSaying(0)
    }

    initializeSays () {
        let loader = new THREE.TextureLoader()

        this.says = []

        for (let i = 0; i < SAYS_IMAGES.length; i++) {
            let texture = loader.load(SAYS_IMAGES[i].image)

            texture.minFilter = THREE.LinearFilter

            let material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0
            })

            let sprite = new THREE.Sprite(material)

            this.says[i] = {
                texture: texture,
                material: material,
                sprite: sprite
            }
            
            material.tween = new TWEEN.Tween(material)

            sprite.scale.set(SAYS_IMAGES[i].width * .2, SAYS_IMAGES[i].height * .2, 40)
            sprite.position.set(0, 0, 0)

            sprite.position.tween = new TWEEN.Tween(sprite.position)

            this.scene.add(sprite)
        }

    }

    showSaying (image) {

    }

    showSayingDelay (image, delay) {
        let splash = this

        setTimeout(function () {
            splash.showSaying(image)
        }, delay)
    }

    update (time) {
        if (this.says[0].start == undefined) {
            this.says[0].start = true
            this.says[0].material.tween.to({ opacity: 1 }, 20000)
            this.says[0].material.tween.start()

            this.says[0].sprite.position.tween.to({ y: 50 }, 10000)
            this.says[0].sprite.position.tween.start()
        }
    }

}
