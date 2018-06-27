let instance

class Pointer {

    constructor (id, x, y, time) {
        this.id = id

        this.initialize(x, y, time)
    }

    initialize (x, y, time) {
        this.sX = this.x = x
        this.sY = this.y = y

        this.sTime = this.time = time

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
        let disX = x - this.x
        let disY = y - this.y
        let hypotenuse = Math.sqrt(disX * disX + disY * disY)
        let during = time - this.time

        // Aspect
        this.aspX = hypotenuse ? disX / hypotenuse : 0
        this.aspY = hypotenuse ? disY / hypotenuse : 0

        // Speed
        this.speX = during ? disX / during : 0
        this.speY = during ? disY / during : 0

        this.x = x
        this.y = y
        this.time = time
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

        this.listeners = []

        this.initialize()
    }

    initialize () {
        this.pointers = {}

        this.scene.canvas.addEventListener('touchstart', this.onTouchStart.bind(this))
        this.scene.canvas.addEventListener('touchmove', this.onTouchMove.bind(this))
        this.scene.canvas.addEventListener('touchend', this.onTouchEnd.bind(this))
        this.scene.canvas.addEventListener('touchcancel', this.onTouchCancel.bind(this))
    }

    listen (listener) {
        for (let index in this.listeners) {
            if (this.listeners[index] === listener) {
                return
            }
        }

        this.listeners.push(listener)
    }

    /**
     * Called when touch start.
     */
    onTouchStart (event) {
        event.preventDefault()

        let actives = {}

        for (let index = 0; index < event.changedTouches.length; index ++) {
            let touch = event.changedTouches[index]

            let pointer = new Pointer(touch.identifier, touch.clientX, touch.clientY, event.timeStamp)

            actives[pointer.id] = pointer

            this.pointers[pointer.id] = pointer
        }

        this.dispatch('onTouchStart', actives)
    }

    /**
     * Called when touch move.
     */
    onTouchMove (event) {
        event.preventDefault()

        let actives = {}

        for (let index = 0; index < event.changedTouches.length; index ++) {
            let touch = event.changedTouches[index]

            if (this.pointers.hasOwnProperty(touch.identifier)) {
                let pointer = this.pointers[touch.identifier]

                actives[pointer.id] = pointer

                pointer.update(touch.clientX, touch.clientY, event.timeStamp)
            }
        }

        this.dispatch('onTouchMove', actives)
    }

    /**
     * Called when touch end.
     */
    onTouchEnd (event) {
        event.preventDefault()

        let actives = {}

        for (let index = 0; index < event.changedTouches.length; index ++) {
            let touch = event.changedTouches[index]

            if (this.pointers.hasOwnProperty(touch.identifier)) {
                let pointer = this.pointers[touch.identifier]

                pointer.update(touch.clientX, touch.clientY, event.timeStamp)

                actives[pointer.id] = pointer

                delete this.pointers[pointer.id]
            }
        }

        this.dispatch('onTouchEnd', actives)
    }

    /**
     * Called when touch cancel.
     */
    onTouchCancel (event) {
        event.preventDefault()

        let actives = {}

        for (let index = 0; index < event.changedTouches.length; index ++) {
            let touch = event.changedTouches[index]

            if (this.pointers.hasOwnProperty(touch.identifier)) {
                let pointer = this.pointers[touch.identifier]

                pointer.update(touch.clientX, touch.clientY, event.timeStamp)

                actives[pointer.id] = pointer

                delete this.pointers[pointer.id]
            }
        }

        this.dispatch('onTouchCancel', actives)
    }

    dispatch (type, actives) {
        this.listeners.forEach((listener) => {
            listener[type].call(this, this.pointers, actives)
        })
    }
}
