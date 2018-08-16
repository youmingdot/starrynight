import StackBlur from '../libs/stackblur'
import TWEEN from '../libs/tween'

import Sprite from 'sprite'

export default class SummarySprite extends Sprite {

    initialize () {
        super.initialize()

        this.stackOrder = 18

        this.context = this.canvas.getContext('2d')

        this.poster = undefined

        this.initializeCardGap()
    }

    initializeCardGap () {
        let gapWidth = this.sn.width / 12
        let gapHeight = this.sn.width / 8

        let width = this.sn.width - gapWidth * 2
        let height = this.sn.height - gapHeight * 2

        this.setShowLeft(gapWidth)
        this.setShowTop(gapHeight)
        this.setShowWidth(width)
        this.setShowHeight(height)

        this.gapWidth = gapWidth
        this.gapHeight = gapHeight

        this.canvas.width = width
        this.canvas.height = height
    }

    drawBackground () {
        this.context.rect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fillStyle = '#000000'
        this.context.fill()
    }

    drawCloseButton (context) {
        if (this.closeImage == undefined) {
            this.closeImage = wx.createImage()
            this.closeImage.src = 'images/close.png'

            this.closeSize = Math.min(this.gapWidth, this.gapHeight) * 1.5
        }

        let left = this.gapWidth - this.closeSize / 3
        let top = this.gapHeight - this.closeSize / 3

        context.drawImage(this.closeImage, left, top, this.closeSize, this.closeSize)
    }

    setMovie (movie) {
        this.movie = movie
    }

    setMoviePoster (filePath) {
        this.poster = wx.createImage()

        this.poster.onload = this.prepareMoviePoster.bind(this)

        this.poster.src = filePath
    }

    prepareMoviePoster () {
        let canvas = wx.createCanvas()
        let context = canvas.getContext('2d')

        canvas.height = this.showHeight * 3 / 10
        canvas.width = canvas.height * this.poster.width / this.poster.height

        context.drawImage(this.poster, 0, 0, canvas.width, canvas.height)

        this.posterCanvas = canvas

        this.poster.alpha = 0
        this.poster.blur = 180

        new TWEEN.Tween(this.poster)
            .to({ alpha: 1 }, 800)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()

        new TWEEN.Tween(this.poster)
            .to({ blur: 0 }, 1200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()

        this.showMovie()
    }

    drawMoviePoster () {
        let canvas = wx.createCanvas()
        let context = canvas.getContext('2d')

        canvas.width = this.posterCanvas.width
        canvas.height = this.posterCanvas.height

        context.globalAlpha = this.poster.alpha

        context.drawImage(this.posterCanvas, 0, 0, canvas.width, canvas.height)

        StackBlur.canvasRGB(canvas, 0, 0, canvas.width, canvas.height, this.poster.blur)

        let showLeft = this.gapHeight * 2 / 3
        let showTop = this.gapHeight * 2 / 3

        this.context.drawImage(canvas, showLeft, showTop, canvas.width, canvas.height)
    }

    showMovie () {
        this.rank = {
            alpha: 0
        }

        new TWEEN.Tween(this.rank)
            .to({ alpha: 1 }, 1200)
            .delay(100)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()
    }

    drawRank () {
        let canvas = wx.createCanvas()

        canvas.width = 200
        canvas.height = 50

        let context = canvas.getContext('2d')
        
        context.beginPath()
        context.font = `40px Arial`
        context.fillStyle = `rgba(250, 250, 250, ${this.rank.alpha})`

        context.fillText('Rank', 0, 40)
        context.fill()
        context.stroke()

        this.context.drawImage(canvas, 0, 0, canvas.width, canvas.height)
    }

    render (canvas, context, time) {
        this.drawBackground()

        if (this.posterCanvas != undefined) {
            this.drawMoviePoster()

            this.drawRank()
            //
        }
        
        super.render(canvas, context, time)

        this.drawCloseButton(context)
    }
}
