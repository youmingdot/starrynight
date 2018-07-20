import * as THREE from '../libs/three'

import ViewState from '../states/view'

import Sprite from 'sprite'

let viewState = new ViewState()

const PARTICLE_AMOUNT = 1

const STAR_INTENSITY = 1.61
const STAR_HUE = 0.1
const STAR_SATURATION = 0.7
const STAR_LIGHTNESS = 0.45

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()

        this.createThreeWorld()

        this.initializeLight()

        this.initializeSea()

        this.setVisible(true)

        this.camera.position.set(-20, 20, 20)

        this.camera.lookAt(0, 0, 0)
    }

    initializeLight () {
        this.light = new THREE.AmbientLight(0xffffff)

        this.scene.add(this.light)
    }

    initializeSea () {
        let vertices = new Float32Array(PARTICLE_AMOUNT * 3)

        // for (let i = 0; i < PARTICLE_AMOUNT; i ++) {
        //     vertices.set([i], i * 3)
        // }

        let geometry = new THREE.BufferGeometry()

        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))

        let vsScript = `
            const float PI = 3.14159265358979323846264;
            
            void main(void) {
                vec3 pos = position;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = 200.0;
            }
        `

        let fsScript = `
            precision highp float;
            uniform float uTime;
            uniform float uIntensity;
            uniform float uHue;
            uniform float uSaturation;
            uniform float uLightness;
            
            vec3 hsv2rgb(vec3 c)
            {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            const float PI = 3.14159265358979323846264;
            
            void main(void) {
                float timeFactor = mix(0.9, 1.0, sin(uTime * 0.002));
                
                vec2 toCenter = (gl_PointCoord.xy - 0.5) * 2.0;
                
                float len = length(toCenter);
                
                float alpha = pow(clamp(1.0 - len, 0.0, 1.0) * uIntensity, uIntensity) * timeFactor;
            
                vec3 color = hsv2rgb(vec3(uHue, uSaturation * len * timeFactor, uLightness + (1.0 - len)));
            
                gl_FragColor = vec4(color, alpha);
            }
        `

        let uniforms = {
            uTime: { value: 0 },
            uIntensity: { value: STAR_INTENSITY },
            uHue: { value: STAR_HUE },
            uSaturation: { value: STAR_SATURATION },
            uLightness: { value: STAR_LIGHTNESS },
        }

        let material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vsScript,
            fragmentShader: fsScript,
            side: THREE.DoubleSide,
            transparent: true
        })

        this.seaUniforms = uniforms
        this.seaPoints = new THREE.Points(geometry, material)

        this.scene.add(this.seaPoints)
    }

    update (time) {
        this.seaUniforms.uTime.value = time
    }

}
