import SimplexNoise from '../libs/simplex'
import * as THREE from '../libs/three'
import TWEEN from '../libs/tween'

import Sprite from 'sprite'

const PARTICLE_FIELD_SEGMENT_SIZE = 200
const PARTICLE_FIELD_GRID_SEG = 3
const PARTICLE_FIELD_GRID_SIZE = 2000

const SCENE_CAMERA_HORIZONTAL_DISTANCE = 750
const SCENE_CAMERA_VERTICAL_BASE_DISTANCE = 110
const SCENE_CAMERA_VERTICAL_UP_DISTANCE = 200
const SCENE_CAMERA_VERTICAL_DOWN_DISTANCE = 60

const PARTICLE_TEXTURE_SIZE = 128

const NAV_SEARCH_SIZE_MIN = 50
const NAV_SEARCH_SIZE_MAX = 100
const NAV_SEARCH_ZOOM_THRESHOLD = .7
const NAV_SEARCH_ITEMS_MAX = 200
const POST_SEARCH_WITH_TAG_RESULT_MAX = 200
const PARTICLE_THUMB_SIZE = 128
const STEP_CIRCLE_PARTICLE_AMOUNT_PER_DEGREE = 100

export default class StarrySprite extends Sprite {

    initialize () {
        super.initialize()

        this.textureLoader = new THREE.TextureLoader()

        this.createThreeWorld()

        this.scene.fog = new THREE.FogExp2(0x070707, 0.0006)

        this.renderer.shadowMap.enabled = true
        
        this.simplex = new SimplexNoise()

        this.colorMapTexture = this.textureLoader.load('images/color_map.png')
        this.colorMapTexture.wrapS = THREE.RepeatWrapping
        this.colorMapTexture.wrapT = THREE.RepeatWrapping

        this.zoom = 0

        this.cameraPosition = new THREE.Vector3(0, SCENE_CAMERA_VERTICAL_BASE_DISTANCE, 0)
        this.cameraAngle = 0
        this.cameraUp = new THREE.Vector3(0, 1, 0)
        this.cameraLookAt = new THREE.Vector3(0, SCENE_CAMERA_VERTICAL_BASE_DISTANCE, SCENE_CAMERA_HORIZONTAL_DISTANCE)

        this.initializeCloud()

        this.setVisible(true)

        this.entryStarry()
    }

    initializeCloud () {
        this.centerX = this.centerY = 0

        this.clouds = []

        let baseXY = - PARTICLE_FIELD_GRID_SEG * PARTICLE_FIELD_GRID_SIZE / 2

        for (let i = 0; i < PARTICLE_FIELD_GRID_SEG * PARTICLE_FIELD_GRID_SEG; i ++) {
            this.clouds[i] = this.createCloud(
                baseXY + i % PARTICLE_FIELD_GRID_SEG * PARTICLE_FIELD_GRID_SIZE,
                baseXY + Math.floor(i / PARTICLE_FIELD_GRID_SEG) * PARTICLE_FIELD_GRID_SIZE
            )
        }
    }

    createCloud (offsetX, offsetZ) {
        let geometry = new THREE.Geometry()

        let gapSize = PARTICLE_FIELD_GRID_SIZE / PARTICLE_FIELD_SEGMENT_SIZE

        for (let x = 0; x < PARTICLE_FIELD_SEGMENT_SIZE; x ++) {
            for (let z = 0; z < PARTICLE_FIELD_SEGMENT_SIZE; z ++) {
                geometry.vertices.push(new THREE.Vector3(x * gapSize, 0, z * gapSize))
            }
        }

        let vsScript = `
            varying float vAlpha;
            varying vec2 vColorMapPos;
            varying float vAlphaIntensity;
            varying float vZoom;
            uniform float uTime;
            uniform float uZoom;
            uniform float uFading;
            uniform vec3 uPosOffset;
            uniform vec3 uPosFieldOffset;
            uniform vec3 uCameraVector;
        
            const float PI = 3.14159265358979323846264;
            
            #include <fog_pars_vertex>
            #include <snoise2d>
            
            void main(void) {
                vec3 refPos = position + uPosFieldOffset;

                #include <begin_vertex>

                vColorMapPos = refPos.xz;

                float fixedPosNoiseRatio = (snoise(refPos.xz * 0.1) + snoise(refPos.xz * 0.005)) * .5;

                fixedPosNoiseRatio = 1.0 - (cos(fixedPosNoiseRatio * PI) + 1.0) / 2.0 - snoise(refPos.xz * .1) - snoise(refPos.xz * .03);

                fixedPosNoiseRatio -= snoise(refPos.xz * .003 + 2.1) * 1.5 + snoise(refPos.xz * .3 + 1.1)  + snoise(refPos.xz * .001 + 1.1);

                fixedPosNoiseRatio *= .5;

                vec3 pos = position + uPosOffset;

                vec4 modelViewPos = modelViewMatrix * vec4( pos + uCameraVector, 1.0 );

                float distanceToCamera = sqrt(modelViewPos.x * modelViewPos.x + modelViewPos.z * modelViewPos.z);

                float offsetY = snoise(refPos.xz * 0.0013 + 4.0) * - 40.00 + snoise(refPos.xz * 0.0006 + 32.0) * - 90.0;

                pos.x += (snoise(refPos.xz * 0.3) - .5) * 8.0;
                pos.y += offsetY + snoise(refPos.xz * 200. + 12.) * 10.0 + (1. - step(0., fixedPosNoiseRatio)) * 99999.;
                pos.z += (snoise(refPos.xz * 0.4) - .5) * 8.0;

                modelViewPos = modelViewMatrix * vec4( pos, 1.0 );

                distanceToCamera = sqrt(modelViewPos.x * modelViewPos.x + modelViewPos.y * modelViewPos.y + modelViewPos.z * modelViewPos.z);

                float blinkRatio = step(.1, snoise(refPos.xz)) * snoise(refPos.xz * 1.0 + 30.0 + uTime * 0.0005);

                vAlpha = clamp(mix(0.5, .6 + .4 * blinkRatio, fixedPosNoiseRatio) * uFading * pow(5., clamp(fixedPosNoiseRatio, 0., 1.)), 0., 1.);

                vAlphaIntensity = 1.0 + abs(snoise(refPos.xz * 400.0) * .8) * (.3 + blinkRatio * .7);

                gl_PointSize = mix(500.0, 5000.0, pow(uZoom, 2.1)) / distanceToCamera * 6.0 * mix(0.4, 1.0, fixedPosNoiseRatio) * (.8 + blinkRatio * .3);

                gl_Position = projectionMatrix * modelViewPos;

                vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );

                #include <fog_vertex>
            }
        `

        let fsScript = `
            varying float vAlpha;
            varying vec2 vColorMapPos;
            uniform sampler2D uColorMap;
            uniform float uZoom;
            
            const float PI = 3.14159265358979323846264;

            #include <common>
            #include <fog_pars_fragment>
            
            float clampNorm(float val, float min, float max) {
                return clamp((val - min) / (max - min), 0.0, 1.0);
            }
            
            void main(void) {
                float colorMapScale = 200.0;

                gl_FragColor = texture2D(uColorMap, mod(vColorMapPos, colorMapScale) / colorMapScale);

                float distanceToCenter = length(gl_PointCoord.xy - .5) * 2.;

                gl_FragColor.a = (step(0., distanceToCenter) - step(.25, distanceToCenter)) * 1.;
                gl_FragColor.a += (step(.25, distanceToCenter) - step(.27, distanceToCenter)) * mix(1., .4, (distanceToCenter - .25) / (.27 - .25));
                gl_FragColor.a += (step(.27, distanceToCenter) - step(.3, distanceToCenter)) * mix(.4, .15, (distanceToCenter - .27) / (.3 - .27));
                gl_FragColor.a += (step(.3, distanceToCenter) - step(1., distanceToCenter)) * mix(.15, 0., (distanceToCenter - .3) / (1. - .3));

                gl_FragColor.a = pow(abs(gl_FragColor.a), 1.0) * vAlpha * ( 1. - clampNorm(uZoom, .75, 1.) * .4);

                #include <fog_fragment>
            }
        `

        let uniforms = {
            fogColor: { type: 'c', value: new THREE.Color(0) },
            fogDensity: { type: 'f', value: 0.025 },
            fogFar: { type: 'f', value: 2000 },
            fogNear: { type: 'f', value: 1 },
            uColorMap: { type: 't' , value: this.colorMapTexture },
            uColorMapScale: { type: 'f', value: 1 },
            uTime: { type: 'f', value: 0 },
            uZoom: { type: 'f', value: 0 },
            uFading: { type: 'f', value: 0 },
            uPosOffset: { type: 'v3', value: new THREE.Vector3(offsetX, 0, offsetZ) },
            uPosFieldOffset: { type: 'v3', value: new THREE.Vector3(offsetX, 0, offsetZ) },
            uCameraVector: { type: 'v3', value: new THREE.Vector3(0, 0, 0) },
        }

        let material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vsScript,
            fragmentShader: fsScript,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
            fog: true,
        })

        let points = new THREE.Points(geometry, material)

        this.scene.add(points)

        return {
            offsetX: offsetX,
            offsetZ: offsetZ,
            geometry: geometry,
            material: material,
            points: points,
            uniforms: uniforms
        }
    }

    entryStarry () {
        for (let i = 0; i < this.clouds.length; i ++) {
            new TWEEN.Tween(this.clouds[i].uniforms.uFading)
                .to({ value: 1 }, 3000)
                .delay(500)
                .easing(TWEEN.Easing.Quadratic.In)
                .start()
        }
    }
    
    move (disX, disY) {
        //this.cameraPosition.x += x 
    }

    calculateCamera () {
        this.cameraPosition.y = this.calculateHight(this.zoom)

         
    }

    calculateHight (k) {
        let s = 1.70158

        let pos = 1 - k * k * ((s + 1) * k - s)

        return SCENE_CAMERA_VERTICAL_DOWN_DISTANCE + (SCENE_CAMERA_VERTICAL_BASE_DISTANCE - SCENE_CAMERA_VERTICAL_DOWN_DISTANCE) * pos
    }

    update (time) {
        this.calculateCamera()

        this.camera.position.copy(this.cameraPosition)
        this.camera.up.copy(this.cameraUp)
        this.camera.lookAt(this.cameraLookAt)

        this.cameraPosition.x += 0.5
        this.cameraPosition.z += 0.5

        for (let i = 0; i < this.clouds.length; i ++) {
            this.clouds[i].uniforms.uTime.value = time
            this.clouds[i].uniforms.uCameraVector.value.x = this.cameraPosition.x
            this.clouds[i].uniforms.uCameraVector.value.y = this.cameraPosition.y
            this.clouds[i].uniforms.uCameraVector.value.z = this.cameraPosition.z
            this.clouds[i].uniforms.uZoom.value = this.zoom
        }
    }
}
