import Toucher from '../scene/toucher'

export default class Sprite {

    /**
     * Create a sprite.
     */
    constructor (scene) {
        this.scene = scene

        this.initialize()

        Toucher.instance().listen(this)
    }

    /**
     * Initialize the sprite.
     */
    initialize () {
        //
    }

    /**
     * Do updating.
     */
    update () {
        //
    }

    /**
     * Called when touch start.
     */
    onTouchStart (pointers, actives) {

    }

    /**
     * Called when touch move.
     */
    onTouchMove (pointers, actives) {

    }

    /**
     * Called when touch end.
     */
    onTouchEnd (pointers, actives) {

    }

    /**
     * Called when touch cancel.
     */
    onTouchCancel (pointers, actives) {

    }
}
