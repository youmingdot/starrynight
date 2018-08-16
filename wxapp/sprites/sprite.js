import * as THREE from '../libs/three'

export default class Sprite {

    constructor (sn) {
        this.sn = sn

        this.initialize()
    }

    initialize () {
        this.canvas = wx.createCanvas()

        this.visible = false
        this.stackOrder = 0

        this.showLeft = 0
        this.showTop = 0
        this.showWidth = this.sn.width
        this.showHeight = this.sn.height
    }

    createThreeWorld () {
        this.context = this.canvas.getContext('webgl')

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(100, this.showWidth / this.showHeight, 1, 3000)

        this.scene.add(this.camera)

        this.renderer = new THREE.WebGLRenderer({ context: this.context, antialias: true, alpha: true })
        this.renderer.setClearColor(0x000000, 0)
        this.renderer.setSize(this.showWidth, this.showHeight)

        this.camera.position.set(0, 0, 0)
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
        if (this.scene !== undefined) {
            this.camera.aspect = showWidth / showHeight
            this.renderer.setSize(showWidth, showHeight)
        }
    }

    update (time) {
        //
    }

    render (canvas, context, time) {
        if (this.scene !== undefined) {
            this.renderer.render(this.scene, this.camera)
        }

        context.drawImage(this.canvas, this.showLeft, this.showTop, this.showWidth, this.showHeight)
    }
}
