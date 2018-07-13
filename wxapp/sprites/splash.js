import SimplexNoise from '../libs/simplex'
import * as THREE from '../libs/three'

import ViewState from '../states/view'

import Sprite from 'sprite'

let viewState = new ViewState()

const BASE_RADIUS = 35
const PARTICLE_AMOUNT = 36000
const PARTICLE_DEGREE_AMOUNT = 100

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()

        this.simplex = new SimplexNoise(Math.random)

        this.light = new THREE.AmbientLight(0xffffff)

        this.initializeCloud()
    }

    initializeCloud () {
        let geometry = new THREE.Geometry()

        let material = new THREE.PointsMaterial({
            size: 0.1, vertexColors: true, color: 0xffffff, blending: THREE.AddEquation, depthTest: false,
            transparent: true, opacity: 0.7
        })

        for (let i = 0; i < PARTICLE_AMOUNT; i ++) {
            geometry.vertices.push(new THREE.Vector3(0, 200, 0))
            geometry.colors.push(new THREE.Color(0xffffff))
        }

        let points = new THREE.Points(geometry, material)

        this.cloud = {
            geometry: geometry,
            material: material,
            points: points
        }

        for (let i in this.cloud.geometry.vertices) {
            let particle = this.cloud.geometry.vertices[i]

            let angle = i / 180.0 * Math.PI

            let radius = BASE_RADIUS + Math.floor(i / PARTICLE_AMOUNT * PARTICLE_DEGREE_AMOUNT) / 3

            particle.x = radius * Math.sin(angle)
            particle.z = radius * Math.cos(angle)
        }
    }

    show () {
        this.sn.scene.add(this.light)
        this.sn.scene.add(this.cloud.points)
    }

    hide () {
        this.sn.scene.remove(this.light)
        this.sn.scene.remove(this.cloud.points)
    }

    update (time) {
        this.setVisible(viewState.splashing)

        if (this.isVisible()) {
            this.updateClouds(time)
        }
    }

    updateClouds (time) {
        for (let i in this.cloud.geometry.vertices) {
            let particle = this.cloud.geometry.vertices[i]

            particle.x = time - 2000
        }

        console.log(time)
    }

}
