import Perlin from '../libs/perlin'
import * as THREE from '../libs/three'

import ViewState from '../states/view'

import Sprite from 'sprite'

let viewState = new ViewState()

function randomColor() {
    var arrHex = ["0","1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d","e","f"],
        strHex = "0x",
        index;
    for(var i = 0; i < 6; i++) {
        index = Math.round(Math.random() * 15);
        strHex += arrHex[index];
    }
    return strHex;
}

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()

        this.pl = new Perlin(Math.random())

        this.light = new THREE.DirectionalLight(0xffffff)

        this.lookAt = new THREE.Vector3()

        this.initializeCloud()
    }

    initializeCloud () {
        let starTexture  = new THREE.TextureLoader().load('./images/star.png');

        this.cloudGeometry = new THREE.Geometry()
        this.cloudMaterial = new THREE.PointsMaterial({
            size: Math.random() * 4 + 2, map: starTexture, vertexColors: true, color: 0xffffff, blending: THREE.AddEquation,
            depthTest: false, transparent: true
        })

        for (let x = -40; x <= 40; x++) {
            for (let y = -40; y <= 40; y++) {
                let no = this.pl.noise((x + 40) / 80, (y + 40) / 80, 0) * 100

                let particle = new THREE.Vector3(x * 2, y * -2, no);
                this.cloudGeometry.vertices.push(particle);
                this.cloudGeometry.colors.push(new THREE.Color(+randomColor()));
            }
        }

        this.cloud = new THREE.Points(this.cloudGeometry, this.cloudMaterial)
    }

    show () {
        this.sn.scene.add(this.light)
        this.sn.scene.add(this.cloud)

        this.sn.camera.position.x = 0
        this.sn.camera.position.y = -50
        this.sn.camera.position.z = 70

        this.lookAt.x = 0
        this.lookAt.y = 50
        this.lookAt.z = 0

        this.sn.camera.lookAt(this.lookAt)
    }

    hide () {
        this.sn.scene.remove(this.light)
        this.sn.scene.remove(this.cloud)
    }

    update (time) {
        this.setVisible(viewState.splashing)

        let material = this.cloud.material

        material.size = 1.5 * ( 2.0 + Math.sin(0.002 * time ) )
    }

}
