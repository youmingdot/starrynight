import SimplexNoise from '../libs/simplex'
import TWEEN from '../libs/tween'
import * as THREE from '../libs/three'

import ViewState from '../states/view'

import Sprite from 'sprite'

let viewState = new ViewState()

const PARTICLE_AMOUNT = 360

const SAYS_MIN_SHOW_TIME = 3000
const SAYS_PARTICLE_AMOUNT = 36000
const SAYS_IMAGE_DENSITY = 8

const SAYS_IMAGES = [
    'images/splash/splash-says-1.png',
    'images/splash/splash-says-2.png',
    'images/splash/splash-says-3.png',
    'images/splash/splash-says-4.png',
    'images/splash/splash-says-5.png',
    'images/splash/splash-says-name.png',
]

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()

        this.loader = new THREE.TextureLoader()

        this.light = new THREE.AmbientLight(0xffffff)

        this.pointTexture = this.loader.load('images/star.png')

        // this.initializeCloud()

        this.initializeSays()
    }

    initializeSays () {
        let geometry = new THREE.Geometry()

        let material = new THREE.PointsMaterial({
            size: 20,
            sizeAttenuation: true,
            map: this.pointTexture,
            vertexColors: true,
            blending: THREE.AddEquation,
            alphaTest: 0.2,
            depthTest: false,
            transparent: true,
            opacity: 0.1
        })

        material.tween = new TWEEN.Tween(material)

        for (let i = 0; i < SAYS_PARTICLE_AMOUNT; i ++) {
            let particleX = Math.random() * 800 - 400
            let particleZ = Math.random() * 800 - 400
            let particleY = 200 + Math.random() * 400

            let particle = new THREE.Vector3(particleX, particleY, particleZ)

            particle.tween = new TWEEN.Tween(particle)

            geometry.vertices.push(particle)
            geometry.colors.push(new THREE.Color(0xffffff))
        }

        let points = new THREE.Points(geometry, material)

        this.saysCloud = {
            geometry: geometry,
            material: material,
            points: points
        }

        this.startSaying(0)
    }

    startSaying (sayNo) {
        if (sayNo >= SAYS_IMAGES.length) {
            return
        }

        this.loader.load(SAYS_IMAGES[sayNo], this.showSaying.bind(this))
    }

    showSaying (image) {
        this.sayingStartTime = this.sayingStartTime !== undefined ? this.sayingStartTime : Date.now() - SAYS_MIN_SHOW_TIME

        let sayingShowTime = Date.now() - SAYS_MIN_SHOW_TIME

        if (sayingShowTime < SAYS_MIN_SHOW_TIME) {
            return this.showSayingDelay(image, SAYS_MIN_SHOW_TIME - sayingShowTime)
        }

        image = image.image

        let scaleRatio = Math.min(image.width / window.innerWidth, image.height / window.innerHeight)

        let imageCanvas = wx.createCanvas()

        imageCanvas.width = Math.floor(scaleRatio * image.width)
        imageCanvas.height = Math.floor(scaleRatio * image.height)

        let canvasCtx = imageCanvas.getContext('2d')

        canvasCtx.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height)

        let pixels = canvasCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height).data

        this.moveSayingPoints(pixels, imageCanvas.width, imageCanvas.height)
    }

    showSayingDelay (image, delay) {
        let splash = this

        setTimeout(function () {
            splash.showSaying(image)
        }, delay)
    }

    getVisiblePixelCount (pixels, width, height) {
        let count = 0

        for (let x = 0; x < width; x ++) {
            for (let y = 0; y < height; y ++) {
                if (this.isVisiblePixel(pixels, x, y, width)) {
                    count += 1
                }
            }
        }

        return count
    }

    moveSayingPoints (pixels, width, height) {
        let visiblePixelCount = this.getVisiblePixelCount(pixels, width, height)

        let vertices = this.saysCloud.geometry.vertices
        let colors = this.saysCloud.geometry.colors

        let pixelNo = 0

        for (let x = 0; x < width; x ++) {
            for (let y = 0; y < height; y ++) {
                let visibleColor = this.isVisiblePixel(pixels, x, y, width)

                if (visibleColor) {
                    let startParticleNo = Math.floor(vertices.length * pixelNo / visiblePixelCount)
                    let endParticleNo = Math.floor(vertices.length * (pixelNo + 1) / visiblePixelCount)

                    endParticleNo = Math.min(vertices.length - 1, endParticleNo)

                    for (let i = startParticleNo; i <= endParticleNo; i ++) {
                        //colors[i].set(visibleColor)
                        vertices[i].tween.to({
                            x: (- width / 2 + x + Math.random()) * SAYS_IMAGE_DENSITY,
                            y: 1500,
                            z: (height / 2 - y + Math.random()) * SAYS_IMAGE_DENSITY
                        }, 2000).start()
                    }

                    pixelNo ++
                }
            }
        }

        this.saysCloud.material.tween.to({
            opacity: 1
        }, 2000).start()
    }

    isVisiblePixel (pixels, posX, posY, width) {
        let pos = posY * width * 4 + posX * 4

        if (pixels[pos + 3] > 0) {
            return (pixels[pos] << 16) + (pixels[pos + 1] << 8) + pixels[pos + 2]
        }

        return 0
    }

    initializeCloud () {
        let geometry = new THREE.Geometry()

        // let material = new THREE.PointsMaterial({
        //     size: IMAGE_DENSITY * 4,
        //     sizeAttenuation: true,
        //     map: pointTexture,
        //     vertexColors: true,
        //     blending: THREE.AddEquation,
        //     depthTest: false,
        //     transparent: true,
        //     opacity: 0.7
        // })
        //
        // for (let i = 0; i < PARTICLE_AMOUNT; i ++) {
        //     let particleX = Math.random() * 300 - 150
        //     let particleY = 100 + Math.random() * 1000
        //     let particleZ = - Math.random() * 300 - 100
        //
        //     let particle = new THREE.Vector3(particleX, particleY, particleZ)
        //
        //     // particle.baseX = particleX
        //     // particle.baseY = particleY
        //     // particle.baseZ = particleZ
        //     //
        //     // particle.velocityX = Math.random() * 0.01 - 0.005
        //     // particle.velocityY = Math.random() * 0.01 - 0.005
        //     // particle.velocityZ = Math.random() * 0.01 + 0.005
        //
        //     geometry.vertices.push(particle)
        //     geometry.colors.push(new THREE.Color(0xffffff))
        // }
        //
        // let points = new THREE.Points(geometry, material)
        //
        // this.cloud = {
        //     geometry: geometry,
        //     material: material,
        //     points: points
        // }
    }

    show () {
        this.sn.scene.add(this.light)
        this.sn.scene.add(this.saysCloud.points)
    }

    hide () {
        this.sn.scene.remove(this.light)
        this.sn.scene.remove(this.saysCloud.points)
    }

    update (time) {
        let lastTime = this.lastTime !== undefined ? this.lastTime : time

        let useTime = time - lastTime

        this.setVisible(viewState.splashing)

        if (this.isVisible()) {
            this.updateClouds(time, useTime)
        }

        this.lastTime = time
    }

    updateClouds (time, useTime) {
        let lastparticle

        // for (let i in this.cloud.geometry.vertices) {
        //     let particle = this.cloud.geometry.vertices[i]
        //
        //     particle.x += particle.velocityX * useTime
        //     particle.y += particle.velocityY * useTime
        //     particle.z += particle.velocityZ * useTime
        //
        //     if (particle.x > particle.baseX + 20 || particle.x < particle.baseX - 20) {
        //         particle.velocityX = - particle.velocityX
        //     }
        //
        //     if (particle.y > particle.baseY + 5000 || particle.y < particle.baseY - 10) {
        //         particle.velocityY = - particle.velocityY
        //     }
        //
        //     if (particle.z > 1000) {
        //         particle.z = particle.baseZ
        //     }
        //
        //     lastparticle = particle
        // }

        this.saysCloud.geometry.verticesNeedUpdate = true
    }

}
