import * as THREE from '../libs/three'

import {nosie2d} from '../glsls/noise2d'

import Sprite from 'sprite'

const PARTICLE_AMOUNT = 36000

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

        this.initializeShader()

        this.initializeLight()

        this.initializeCircle()

        //this.initializeSays()

        this.setVisible(true)

        this.camera.position.set(0, -500, 0)
        this.lookAt.set(0, 500, 0)
    }

    initializeLight () {
        this.light = new THREE.AmbientLight(0xffffff)

        this.scene.add(this.light)
    }

    initializeShader () {
        let vsScript = `
            attribute vec3 a_position;
            varying vec3 v_pos;
            varying float v_alpha;
            uniform mat4 u_modelViewMatrix;
            uniform mat4 u_projectionMatrix;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform float u_twirl;
            uniform float u_noise_time;
            
            ${nosie2d}
            
            float clampNorm(float val, float min, float max) {
                return clamp((val - min) / (max - min), 0.0, 1.0);
            }
            
            const float PI = 3.14159265358979323846264;
            
            void main(void) {
                gl_PointSize = 2.0;
                vec3 pos = a_position;
                float index = pos.z;
                pos.z = 0.0;
                v_alpha = 1.0;
            
                // 9 groups
                float group = mod(floor(index / 360.0), 9.0);
            
                float angle = index / 180.0 * PI;
                float radius = 300.0 + floor(index / 360.0) * 3.0;
                float toCenter = clamp(radius / 600.0, 0.0, 1.0);
            
                vec3 basePos = pos;
                basePos.x = sin(angle) * radius;
                basePos.y = cos(angle) * radius;
            
                angle += u_time * (1.0 + group * .1) * 0.015;
            
                angle += u_twirl * pow(sin(angle * (1.0 - u_twirl * 0.01)), 3.0) * 0.7;
            
                pos.x = sin(angle) * radius;
                pos.y = cos(angle) * radius;
            
                vec3 finalPos = pos;
            
                finalPos.x = pos.x + snoise(basePos.xy * 1. + u_noise_time * .03 ) * 50.0;
                finalPos.y = pos.y + snoise(basePos.xy * 1. + u_noise_time * .03 + 3.0 ) * 50.0;
            
                v_alpha = toCenter - (sin(pow(toCenter, 1.2) * 60.0) + 1.0) / 2.0 * 0.5;
            
                finalPos.x /= u_resolution.x;
                finalPos.y /= u_resolution.y;
                v_pos = finalPos;
                gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(finalPos, 1.0);
            }
        `

        let fsScript = `
            precision highp float;
            varying vec3 v_pos;
            varying float v_alpha;
            
            void main(void) {
                float len = length(gl_PointCoord.xy - .5) * 2.0;
                float c = 1.0 - len;
                gl_FragColor = vec4(c, c, c, v_alpha);
            }
        `

        this.createShaderProgram(vsScript, fsScript)

        this.shaderParams = {
            aPosition: this.context.getAttribLocation(this.shaderProgram, 'a_position'),
            uTime: this.context.getUniformLocation(this.shaderProgram, 'u_time')
        }

        this.context.enableVertexAttribArray(this.shaderParams.aPosition);

        this.context.vertexAttribPointer(this.shaderParams.aPosition, 3, this.context.FLOAT, false, 0, 0);
    }

    initializeSays () {


        this.startSaying(0)
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
        let bufferData = new Float32Array(PARTICLE_AMOUNT * 3)

        let geometry = new THREE.Geometry()

        let material = new THREE.PointsMaterial({
            size: 10,
            sizeAttenuation: true,
            vertexColors: true,
            blending: THREE.AddEquation,
            depthTest: false,
            transparent: true
        })

        for (let i = 0; i < PARTICLE_AMOUNT; i ++) {
            geometry.vertices.push(new THREE.Vector3(i, 0, 0))

            bufferData.set([i], i * 3)
        }

        let points = new THREE.Points(geometry, material)

        this.circleCloud = {
            geometry: geometry,
            material: material,
            points: points
        }

        this.scene.add(this.circleCloud.points)

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.context.createBuffer())
        this.context.bufferData(this.context.ARRAY_BUFFER, bufferData, this.context.STATIC_DRAW)
    }

    update (time) {

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
