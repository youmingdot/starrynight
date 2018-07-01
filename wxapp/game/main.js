import TWEEN from '../libs/tween'
import * as THREE from '../libs/three'

import Toucher from 'toucher'

import SplashSprite from '../sprites/splash'
import MovieSummarySprite from '../sprites/movie/summary'

export default class StarryNight {

    constructor () {
        this.initialize()
    }

    /**
     * Initialize the world.
     */
    initialize () {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')

        console.log('Screen size: ' + window.innerWidth + ' x ' + window.innerHeight + ' .')

        this.height = window.innerHeight
        this.width = window.innerWidth

        this.wgl = wx.createCanvas()

        this.toucher = new Toucher(this.canvas)

        this.looper = this.loop.bind(this)

        this.createThreeWorld()

        this.sprites = this.createSprites()
    }

    createThreeWorld () {
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 2000)

        this.scene.add(this.camera)

        this.renderer = new THREE.WebGLRenderer({ context: this.wgl.getContext('webgl'), antialias: true })
        this.renderer.setClearColor(0x000000)
        this.renderer.setSize(this.width, this.height)

        this.camera.position.x = -30
        this.camera.position.y = 20
        this.camera.position.z = 20

        this.camera.lookAt(this.scene.position)
    }

    createSprites () {
        return {
            splash: new SplashSprite(this),
            movieSummary: new MovieSummarySprite(this),
        }
    }

    run () {
        window.requestAnimationFrame(this.looper)

        console.log('The Starry Starry Night is running.')
    }

    loop (time) {
        TWEEN.update(time)

        this.updateSprites()

        this.renderer.render(this.scene, this.camera)

        this.ctx.drawImage(this.wgl, 0, 0)

        this.renderSprites()

        window.requestAnimationFrame(this.looper)
    }

    updateSprites () {
        for (let key in this.sprites) {
            if (this.sprites.hasOwnProperty(key)) {
                this.sprites[key].update()
            }
        }
    }

    renderSprites () {
        for (let key in this.sprites) {
            if (this.sprites.hasOwnProperty(key)) {
                this.sprites[key].render()
            }
        }
    }
}
