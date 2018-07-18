export default class Sprite {

    constructor (sn) {
        this.sn = sn

        this.canvas = wx.createCanvas()

        this.visible = false
        this.stackOrder = 0

        this.showLeft = 0
        this.showTop = 0
        this.showWidth = this.sn.width
        this.showHeight = this.sn.height

        this.initialize()
    }

    initialize () {
        //
    }

    isVisible () {
        return this.visible
    }

    setVisible (visible) {
        this.visible = visible
    }

    getStackOrder () {
        return this.stackOrder
    }

    getShowLeft () {
        return this.showLeft
    }

    setShowLeft (showLeft) {
        this.showLeft = showLeft
    }

    getShowTop () {
        return this.showTop
    }

    setShowTop (showTop) {
        this.showTop = showTop
    }

    getShowWidth () {
        return this.showWidth
    }

    setShowWidth (showWidth) {
        if (this.showWidth === showWidth) {
            return
        }

        this.showWidth = showWidth

        this.onResize(this.showWidth, this.showHeight)
    }

    getShowHeight () {
        return this.showHeight
    }

    setShowHeight (showHeight) {
        if (this.showHeight === showHeight) {
            return
        }

        this.showHeight = showHeight

        this.onResize(this.showWidth, this.showHeight)
    }

    onResize (showWidth, showHeight) {
        //
    }

    update (time) {
        //
    }

    render (time) {
        //
    }
}
