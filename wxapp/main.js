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

        wx.onTouchStart(this.onTouchStart.bind(this))
        wx.onTouchMove(this.onTouchMove.bind(this))
        wx.onTouchEnd(this.onTouchEnd.bind(this))
        wx.onTouchCancel(this.onTouchCancel.bind(this))

        this.scene.camera.position.x = -30
        this.scene.camera.position.y = 20
        this.scene.camera.position.z = 20

        this.scene.lookAt(this.scene.scene.position)
    }

    run () {
        console.log('The Starry Starry Night is running.')

        this.loop()
    }

    /**
     * Looping.
     */
    loop () {
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

    /**
     * Called when touch start.
     */
    onTouchStart (event) {

    }

    /**
     * Called when touch move.
     */
    onTouchMove (event) {

    }

    /**
     * Called when touch end.
     */
    onTouchEnd (event) {

    }

    /**
     * Called when touch cancel.
     */
    onTouchCancel (event) {

    }
}
