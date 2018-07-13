import * as THREE from '../libs/three'

import ViewState from '../states/view'

import Sprite from 'sprite'

let viewState = new ViewState()

export default class GalaxySprite extends Sprite {

    initialize () {
        super.initialize()

        let starTexture  = new THREE.TextureLoader().load('./images/star.png');

        this.cloudGeometry = new THREE.Geometry()
        this.cloudMaterial = new THREE.PointsMaterial({
            size: Math.random() * 4 + 2, map: starTexture, vertexColors: true, color: 0xffffff, blending: THREE.AddEquation,
            depthTest: false, transparent: true
        })

        for (let x = -400; x <= 400; x++) {
            for (let y = -400; y <= 400; y++) {
                let no = this.pl.noise(x, y, 0) * 100

                let particle = new THREE.Vector3(x * 2, y * -2, no);
                this.cloudGeometry.vertices.push(particle);
                this.cloudGeometry.colors.push(new THREE.Color(+randomColor()));
            }
        }

        this.cloud = new THREE.Points(this.cloudGeometry, this.cloudMaterial)
    }
}
