import SplashScene from 'scenes/splash'

export default class StarryNight {

    constructor () {
        this.sceneStack = []
        this.scene = null

        this.looper = this.loop.bind(this);

        console.log('Screen size: ' + window.innerWidth + ' x ' + window.innerHeight + ' .')

        this.asTouchHandler();
    }

    /**
     * Make the instance as a touch handler.
     */
    asTouchHandler () {
        wx.onTouchStart(this.onTouchStart.bind(this))
        wx.onTouchMove(this.onTouchMove.bind(this))
        wx.onTouchEnd(this.onTouchEnd.bind(this))
        wx.onTouchCancel(this.onTouchCancel.bind(this))
    }

    run () {
        console.log('The Starry Starry Night is running.')

        this.pushScene(new SplashScene())

        this.loop()
    }

    /**
     * Clear the scene stack and push a new scene.
     */
    replaceScene (scene) {
        this.sceneStack = []
        this.pushScene(scene)
    }

    /**
     * Push a new scene to the stack.
     */
    pushScene (scene) {
        this.sceneStack.push(scene)
        this.scene = scene
    }

    /**
     * Pop a scene.
     */
    popScene () {
        this.sceneStack.pop()

        if (this.sceneStack.length < 1) {
            return this.scene = null
        }

        this.scene = this.sceneStack[this.sceneStack.length - 1]
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
        if (this.scene != null) {
            this.scene.update()
        }
    }

    /**
     * Render to the screen.
     */
    render () {
        if (this.scene != null) {
            this.scene.render()
        }
    }

    /**
     * Called when touch start.
     */
    onTouchStart (event) {
        if (this.scene != null) {
            this.scene.onTouchStart(event)
        }
    }

    /**
     * Called when touch move.
     */
    onTouchMove (event) {
        if (this.scene != null) {
            this.scene.onTouchMove(event)
        }
    }

    /**
     * Called when touch end.
     */
    onTouchEnd (event) {
        if (this.scene != null) {
            this.scene.onTouchEnd(event)
        }
    }

    /**
     * Called when touch cancel.
     */
    onTouchCancel (event) {
        if (this.scene != null) {
            this.scene.onTouchCancel(event)
        }
    }
}
