
let instance

class Pointer {

    constructor (id, x, y, time) {
        this.id = id

        this.sx = this.x = x
        this.sy = this.y = y

        this.time = time

        this.initialize()
    }

    initialize () {
        this.tapping = false
        this.moving = false

        this.aspX = 0
        this.aspY = 0

        this.speed = .0
    }

    /**
     * Update the pointer.
     */
    update (x, y, time) {


        this.x = x
        this.y = y
        this.time = time
    }

    /**
     * Return whether the pointer action is tapping.
     */
    isTap () {
        return this.tapping
    }

    /**
     * Return whether the pointer action is moving.
     */
    isMove () {
        return this.moving
    }
}

export default class Toucher {

    static instance () {
        return instance
    }

    constructor (scene) {
        if (instance) {
            return instance
        }

        instance = this

        this.scene = scene

        this.initialize()
    }

    initialize () {
        this.touching = false

        this.touches = []

        this.scene.canvas.addEventListener('touchstart', this.onTouchStart.bind(this))
        this.scene.canvas.addEventListener('touchmove', this.onTouchMove.bind(this))
        this.scene.canvas.addEventListener('touchend', this.onTouchEnd.bind(this))
        this.scene.canvas.addEventListener('touchcancel', this.onTouchCancel.bind(this))
    }

    /**
     * Called when touch start.
     */
    onTouchStart (event) {
        event.preventDefault()

        this.touching = true
    }

    /**
     * Called when touch move.
     */
    onTouchMove (event) {
        event.preventDefault()

        this.touching = true
    }

    /**
     * Called when touch end.
     */
    onTouchEnd (event) {
        event.preventDefault()


        this.touching = false
    }

    /**
     * Called when touch cancel.
     */
    onTouchCancel (event) {
        event.preventDefault()

        this.touching = false
    }
}
