import * as THREE from '../libs/three'

import {nosie2d} from '../glsls/noise2d'

import Sprite from 'sprite'

const PARTICLE_AMOUNT = 3600
const PARTICLE_NOISE_SPEED = 0.2

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

        this.createThreeWorld()

        this.initializeLight()

        // this.initializeCircle()

        this.initializeSays()

        this.setVisible(true)

        this.camera.position.set(0, 0, 1500)

        this.camera.lookAt(0, 0, 0)

        this.startSaying(0)
    }

    initializeLight () {
        this.light = new THREE.AmbientLight(0xffffff)

        this.scene.add(this.light)
    }

    initializeSays () {
        this.loader = new THREE.TextureLoader()

        this.sayAlpha = .0

        let vertices = new Float32Array(PARTICLE_AMOUNT * 3)
        let buffer = new THREE.BufferAttribute(vertices, 3)

        let geometry = new THREE.BufferGeometry()

        geometry.addAttribute('position', buffer)

        let vsScript = `
            varying float vAlpha;
            uniform float uTime;
            uniform float uTwirl;
            uniform float uNoiseTime;

            const float PI = 3.14159265358979323846264;

            ${nosie2d}

            void main(void) {
                gl_PointSize = 2.0;
                
                vec3 pos = position;
                
                float index = pos.x;
                
                vAlpha = 1.0;

                float group = mod(floor(index / 360.0), 9.0);

                float angle = index / 180.0 * PI;
                float radius = 300.0 + floor(index / 360.0) * 3.0;
                float toCenter = clamp(radius / 600.0, 0.0, 1.0);

                vec3 basePos = pos;
                
                basePos.x = sin(angle) * radius;
                basePos.y = cos(angle) * radius;

                angle += uTime * (1.0 + group * .1) * 0.0015;

                angle += uTwirl * pow(sin(angle * (1.0 - uTwirl * 0.01)), 3.0) * 0.7;

                pos.x = sin(angle) * radius;
                pos.y = cos(angle) * radius;

                vec3 finalPos = pos;

                finalPos.x = pos.x + snoise(basePos.xy * 1. + uNoiseTime * .001 ) * 50.0;
                finalPos.y = pos.y + snoise(basePos.xy * 1. + uNoiseTime * .001 + 1.0 ) * 50.0;

                vAlpha = toCenter - (sin(pow(toCenter, 1.2) * 60.0) + 1.0) / 2.0 * 0.5;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
            }
        `

        let fsScript = `
            precision highp float;
            varying float vAlpha;

            void main(void) {
                float len = length(gl_PointCoord.xy - .5) * 2.0;
                
                float c = 1.0 - len;
                
                gl_FragColor = vec4(c, c, c, vAlpha);
            }
        `

        let uniforms = {
            uNoiseTime: { value: 0 },
            uAlpha: { value: this.sayAlpha }
        }

        let material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vsScript,
            fragmentShader: fsScript,
            side: THREE.DoubleSide,
            transparent: true
        })

        this.sayBuffer = buffer
        this.sayUniforms = uniforms
        this.sayPoints = new THREE.Points(geometry, material)

        this.scene.add(this.sayPoints)
    }

    startSaying (sayNo) {
        if (sayNo >= SAYS_IMAGES.length) {
            return
        }

        this.loader.load(SAYS_IMAGES[sayNo], this.showSaying.bind(this))
    }

    showSaying (image) {

    }

    showSayingDelay (image, delay) {
        let splash = this

        setTimeout(function () {
            splash.showSaying(image)
        }, delay)
    }

    initializeCircle () {
        let vertices = new Float32Array(PARTICLE_AMOUNT * 3)

        for (let i = 0; i < PARTICLE_AMOUNT; i ++) {
            vertices.set([i], i * 3)
        }

        let geometry = new THREE.BufferGeometry()

        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))

        let vsScript = `
            varying float vAlpha;
            uniform float uTime;
            uniform float uTwirl;
            uniform float uNoiseTime;

            const float PI = 3.14159265358979323846264;

            ${nosie2d}

            float clampNorm(float val, float min, float max) {
                return clamp((val - min) / (max - min), 0.0, 1.0);
            }

            void main(void) {
                gl_PointSize = 2.0;
                
                vec3 pos = position;
                
                float index = pos.x;
                
                vAlpha = 1.0;

                float group = mod(floor(index / 360.0), 9.0);

                float angle = index / 180.0 * PI;
                float radius = 300.0 + floor(index / 360.0) * 3.0;
                float toCenter = clamp(radius / 600.0, 0.0, 1.0);

                vec3 basePos = pos;
                
                basePos.x = sin(angle) * radius;
                basePos.y = cos(angle) * radius;

                angle += uTime * (1.0 + group * .1) * 0.0015;

                angle += uTwirl * pow(sin(angle * (1.0 - uTwirl * 0.01)), 3.0) * 0.7;

                pos.x = sin(angle) * radius;
                pos.y = cos(angle) * radius;

                vec3 finalPos = pos;

                finalPos.x = pos.x + snoise(basePos.xy * 1. + uNoiseTime * .001 ) * 50.0;
                finalPos.y = pos.y + snoise(basePos.xy * 1. + uNoiseTime * .001 + 1.0 ) * 50.0;

                vAlpha = toCenter - (sin(pow(toCenter, 1.2) * 60.0) + 1.0) / 2.0 * 0.5;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
            }
        `

        let fsScript = `
            precision highp float;
            varying float vAlpha;

            void main(void) {
                float len = length(gl_PointCoord.xy - .5) * 2.0;
                
                float c = 1.0 - len;
                
                gl_FragColor = vec4(c, c, c, vAlpha);
            }
        `

        let uniforms = {
            uTime: { value: 0 },
            uTwirl: { value: CIRCLE_TWIRL },
            uNoiseTime: { value: 0 }
        }

        let material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vsScript,
            fragmentShader: fsScript,
            side: THREE.DoubleSide,
            transparent: true
        })

        this.circleUniforms = uniforms
        this.circlePoints = new THREE.Points(geometry, material)

        this.scene.add(this.circlePoints)
    }

    update (time) {
        this.sayUniforms.uNoiseTime.value = time * PARTICLE_NOISE_SPEED
        this.sayUniforms.uAlpha.value = this.sayAlpha
    }

}
