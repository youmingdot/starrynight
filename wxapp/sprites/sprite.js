
export default class Sprite {

    constructor (sn) {
        this.sn = sn

        this.visible = false

        this.initialize()
    }

    initialize () {
        //
    }

    setVisible (visible) {
        if (this.visible !== visible) {
            this.visible = visible

            return visible ? this.show() : this.hide()
        }
    }

    isVisible () {
        return this.visible
    }

    show () {
        //
    }

    hide () {
        //
    }

    /**
     * Update the sprite.
     */
    update () {
        //
    }

    /**
     * Render the sprite to the screen.
     */
    render () {
        //
    }
}
