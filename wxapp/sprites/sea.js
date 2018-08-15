import SimplexNoise from '../libs/simplex'
import * as THREE from '../libs/three'

import {nosie2d} from '../glsls/noise2d'

import Sprite from 'sprite'

const SIDE_TORCH = 30
const SIDE_LENGTH = 90
const HILL_ROLLING = 2

const SEA_ALPHA_NOISE = 0
const SEA_OFFSET_NOISE = 0

const STAR_INTENSITY = 1.61
const STAR_HUE = 0.1
const STAR_SATURATION = 0.7
const STAR_LIGHTNESS = 0.45

const PARTICLE_AMOUNT = 36000
const PARTICLE_DISPERSION = 0.1
const PARTICLE_BULGE = 1

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()

        this.createThreeWorld()

        this.renderer.shadowMap.enabled = true
        
        this.simplex = new SimplexNoise()

        this.initializeLight()
        this.initializeCloud()

        this.setVisible(true)

        this.camera.position.set(0, 300, 100)

        this.camera.up.set(0, 1, 0)
        this.camera.lookAt(0, 0, 0)
    }

    move (disX, disY) {
        this.camera.position.x += disX
        this.camera.position.y += disY

        this.camera.lookAt(this.camera.position.x, this.camera.position.y, 0)

        let needsUpdate = false

        if (this.camera.position.x <= this.centerX - SIDE_TORCH) {
            this.centerX -= SIDE_TORCH
            needsUpdate = true
        }

        if (this.camera.position.x >= this.centerX + SIDE_TORCH) {
            this.centerX += SIDE_TORCH
            needsUpdate = true
        }

        if (this.camera.position.y <= this.centerY - SIDE_TORCH) {
            this.centerY -= SIDE_TORCH
            needsUpdate = true
        }

        if (this.camera.position.y >= this.centerY + SIDE_TORCH) {
            this.centerY += SIDE_TORCH
            needsUpdate = true
        }

        console.log(this.camera.position.y + ' - ' + this.centerY)

        if (needsUpdate) {
            this.updatePointsBuffer()
        }
    }

    initializeLight () {
        let light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
  
        let shadow = new THREE.DirectionalLight(0xffffff, .8)
        shadow.position.set(200, 200, 200)
        shadow.castShadow = true
        shadow.shadowDarkness = .2
        
        let background = new THREE.DirectionalLight(0xffffff, .4)
        background.position.set(-100, 200, 50)
        background.castShadow = true
        background.shadowDarkness = .2
        
        this.scene.add(light)
        this.scene.add(shadow)
        this.scene.add(background)
    }

    initializeCloud () {
        let vertices = new Float32Array(PARTICLE_AMOUNT * 3)
        let geometry = new THREE.BufferGeometry()

        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
        
        for (let i = 0; i < PARTICLE_AMOUNT; i++) {
            
        }

        let vsScript = `
            varying vec3 vPos;
            varying float vAlpha;
            varying float vMoviePoint;
            uniform float uTime;
            uniform float uSeaSide;
            uniform float uCenterX;
            uniform float uCenterY;
            uniform float uAlphaNoise;
            uniform float uOffsetNoise;
        
            const float PI = 3.14159265358979323846264;
            
            void main(void) {
                vPos = position;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 8.0;
            }
        `

        let fsScript = `
            precision highp float;
            varying vec3 vPos;
            varying float vAlpha;
            uniform float uTime;
            uniform float uHighLight;
            
            const float PI = 3.14159265358979323846264;
            
            ${nosie2d}
            
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            void main(void) {
                float hue = clamp(snoise(vPos.xy * 10.0) * 0.1, 0.0, 0.1);
                
                float timeFactor = mix(0.3, 0.8, sin(uTime * 0.001 * snoise(vPos.xy * 10.0)));
                
                float len = length((gl_PointCoord.xy - 0.5) * 2.0);
                
                float alpha = pow(clamp(1.0 - len, 0.0, 1.0) * 1.4, 1.8) * timeFactor;
                
                vec3 c = hsv2rgb(vec3(hue, 0.8 * len * timeFactor, clamp(alpha, 0.0, 1.0)));
                
                gl_FragColor = vec4(c, alpha);
            }
        `

        let uniforms = {
            uTime: { value: 0 },
            uSeaSide: { value: Math.sqrt(PARTICLE_AMOUNT) },
            uCenterX: { value: this.centerX },
            uCenterY: { value: this.centerY },
            uHighLight: { value: 0 }
        }

        let material = new THREE.ShaderMaterial({
            size: 8,
            uniforms: uniforms,
            vertexShader: vsScript,
            fragmentShader: fsScript,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
        })

        let points = new THREE.Points(geometry, material)

        this.cloud = {
            vertices: vertices,
            geometry: geometry,
            material: material,
            points: points,
            uniforms: uniforms
        }

        this.scene.add(points)
    }

    updatePointsBuffer () {
        let baseX = this.centerX - SIDE_LENGTH / 2
        let baseY = this.centerY - SIDE_LENGTH / 2

        let vertices = this.seaVertices

        for (let x = 0; x < SIDE_LENGTH; x ++) {
            for (let y = 0; y < SIDE_LENGTH; y ++) {
                let pX = baseX + x
                let pY = baseY + y
                let pZ = this.simplex.noise2D(pX, pY) * 5 - 5

                pX = pX + this.simplex.noise2D(pX * 30, pY * 70) * 1.5
                pY = pY + this.simplex.noise2D(pX * 30 + 7, pY * 70 + 3) * 1.5

                vertices.set([pX, pY, pZ], (x * 90 + y) * 3)
            }
        }

        this.seaGeometry.attributes.position.needsUpdate = true
    }

    initializeSea () {
        this.centerX = 0
        this.centerY = 0

        let vertices = new Float32Array(PARTICLE_AMOUNT * 3)

        let geometry = new THREE.BufferGeometry()

        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))

        this.seaVertices = vertices
        this.seaGeometry = geometry

        this.updatePointsBuffer()

        
    }

    update (time) {
        //this.seaUniforms.uTime.value = time
    }

}
