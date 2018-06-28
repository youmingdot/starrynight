import TWEEN from 'libs/tween'

import Scene from 'scene/scene'

export default class StarryNight {

    constructor () {
        this.initialize()

        this.looper = this.loop.bind(this)
    }

    /**
     * Initialize the Three's world.
     */
    initialize () {
        console.log('Screen size: ' + window.innerWidth + ' x ' + window.innerHeight + ' .')

        this.scene = new Scene(canvas, window.innerWidth, window.innerHeight)

        this.scene.camera.position.x = -30
        this.scene.camera.position.y = 20
        this.scene.camera.position.z = 20

        this.scene.lookAt(this.scene.scene.position)
    }

    run () {
        console.log('The Starry Starry Night is running.')

        window.requestAnimationFrame(this.looper)
    }

    /**
     * Looping.
     */
    loop (time) {
        TWEEN.update(time)

        this.update()
        this.render()

        window.requestAnimationFrame(this.looper)
    }

    /**
     * Do the updating.
     */
    update () {
        this.scene.update()
    }

    /**
     * Render to the screen.
     */
    render () {
        this.scene.render()
    }
}
