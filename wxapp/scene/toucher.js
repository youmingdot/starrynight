
let instance

class Pointer {

    constructor (id, x, y, time) {
        this.id = id

        this.sX = this.x = x
        this.sY = this.y = y

        this.sTime = this.time = time

        this.initialize()
    }

    initialize () {
        // Aspect
        this.aspX = .0
        this.aspY = .0

        // Speed
        this.speX = .0
        this.speY = .0
    }

    /**
     * Update the pointer.
     */
    update (x, y, time) {
        this.calculateSpeed(x, y, time)

        this.x = x
        this.y = y
        this.time = time
    }

    calculateSpeed (x, y, time) {
        let disX = x - this.x
        let disY = y - this.y
        let during = time - this.time


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

        this.pointers = {}

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

        for (let index = 0; index < event.changedTouches.length; index ++) {
            let touch = event.changedTouches[index]

            let pointer = new Pointer(touch.identifier, touch.clientX, touch.clientY, touch.timeStamp)

            this.pointers[pointer.id] = pointer
        }
    }

    /**
     * Called when touch move.
     */
    onTouchMove (event) {
        event.preventDefault()

        this.touching = true

        for (let index = 0; index < event.changedTouches.length; index ++) {
            let touch = event.changedTouches[index]

            if (this.pointers.hasOwnProperty(touch.identifier)) {
                let pointer = this.pointers[touch.identifier]

                pointer.update(touch.clientX, touch.clientY, touch.timeStamp)
            }
        }
    }

    /**
     * Called when touch end.
     */
    onTouchEnd (event) {
        event.preventDefault()

        this.touching = false

        let pointers = []

        for (let index = 0; index < event.changedTouches.length; index ++) {
            let touch = event.changedTouches[index]

            if (this.pointers.hasOwnProperty(touch.identifier)) {
                let pointer = this.pointers[touch.identifier]

                pointer.update(touch.clientX, touch.clientY, touch.timeStamp)

                pointers.push(pointer)

                delete this.pointers[pointer.id]
            }
        }
    }

    /**
     * Called when touch cancel.
     */
    onTouchCancel (event) {
        event.preventDefault()

        this.touching = false

        let pointers = []

        for (let index = 0; index < event.changedTouches.length; index ++) {
            let touch = event.changedTouches[index]

            if (this.pointers.hasOwnProperty(touch.identifier)) {
                let pointer = this.pointers[touch.identifier]

                pointer.update(touch.clientX, touch.clientY, touch.timeStamp)

                pointers.push(pointer)

                delete this.pointers[touch.identifier]
            }
        }
    }
}
