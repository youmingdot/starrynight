import Toucher from '../game/toucher'
import Handler from 'handler'

import ViewState from '../states/view'
import * as THREE from "../libs/three";

let viewState = new ViewState()

class TrekToucher extends Toucher {

    initialize () {
        this.paning = false

        this.lastPanX = this.lastPanY = 0

        let panOptions = {
            threshold: 2
        }

        this.hammer.on('panstart', this.onPanStart.bind(this), panOptions)
        this.hammer.on('panmove', this.onPanMove.bind(this), panOptions)
        this.hammer.on('panend', this.onPanEnd.bind(this), panOptions)
    }

    onPanStart (event) {
        this.paning = true

        this.lastPanX = event.center.x
        this.lastPanY = event.center.y
    }

    onPanMove (event) {
        this.paning = true

        let dX = event.center.x - this.lastPanX
        let dY = event.center.y - this.lastPanY

        this.moveCamera(dX, dY)

        this.lastPanX = event.center.x
        this.lastPanY = event.center.y
    }

    onPanEnd (event) {
        this.paning = false

        let dX = event.center.x - this.lastPanX
        let dY = event.center.y - this.lastPanY

        this.moveCamera(dX, dY)

        this.lastPanX = event.center.x
        this.lastPanY = event.center.y
    }

    moveCamera (x, y) {
        this.sn.camera.position.x -= x
        this.sn.camera.position.y -= y
    }

}

export default class TrekHandler extends Handler {

    initialize () {
        this.toucher = new TrekToucher(this)

        this.loaded = false

        this.lookAt = new THREE.Vector3()

        let program = this.sn.wglCtx.createProgram()

        let shader = this.sn.wglCtx.createShader(this.sn.wglCtx.VERTEX_SHADER)

        this.sn.wglCtx.shaderSource(shader, `
            attribute vec3 a_position;
            uniform mat4 u_modelViewMatrix;
            uniform mat4 u_projectionMatrix;
            uniform vec2 u_resolution;
            
            const float PI = 3.14159265358979323846264;
            
            void main(void) {
                gl_PointSize = 256.0;
                vec3 pos = a_position;
                pos.x /= u_resolution.x;
                pos.y /= u_resolution.y;
                gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(pos, 1.0);
            }
        `);

        this.sn.wglCtx.compileShader(shader);

        this.sn.wglCtx.attachShader(program, shader);

        debugger
    }

    resume () {
        super.resume()

        viewState.treking = true

        this.sn.camera.position.x = 0
        this.sn.camera.position.y = 0
        this.sn.camera.position.z = 0

        this.lookAt.x = 0
        this.lookAt.y = 2000
        this.lookAt.z = 0

        this.sn.camera.lookAt(this.lookAt)
    }

    showStarryRiver () {

    }
}
