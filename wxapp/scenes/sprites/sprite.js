
export default class Sprite {

    /**
     * Create a sprite.
     */
    constructor (canvas, left, top, width, height) {
        this.canvas = canvas

        this.left = left
        this.top = top
        this.width = width
        this.height = height

        this.visible = true
    }

    /**
     * Set the sprite's visibility.
     */
    setVisible (visible) {
        this.visible = visible
    }

    /**
     * Return whether or not the sprite is visible.
     */
    isVisible () {
        return this.visible
    }

    /**
     * Draw the sprite to the canvas.
     */
    draw () {
        if (!this.isVisible()) {
            return
        }

        this.doDraw(this.canvas)
    }

    /**
     * Drawing
     */
    doDraw (canvas) {}
}
