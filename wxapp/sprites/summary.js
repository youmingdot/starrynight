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

        this.background = {
            size: 0
        }

        new TWEEN.Tween(this.background)
            .to({ size: 1 }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()
    }

    drawBackground () {
        let left = this.canvas.width / 2 - this.canvas.width * this.background.size / 2
        let top = this.canvas.height / 2 - this.canvas.height * this.background.size / 2
        let width = this.canvas.width - left * 2
        let height = this.canvas.height - top * 2

        this.context.rect(left, top, width, height)
        this.context.fillStyle = `rgba(0, 0, 0, ${this.background.size})`
        this.context.fill()
    }

    doClose () {
        if (this.isClosing != undefined) {
            return
        }

        this.isClosing = true

        new TWEEN.Tween(this.poster)
            .to({ alpha: 0 }, 800)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()

        new TWEEN.Tween(this.poster)
            .to({ blur: 180 }, 800)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()

        new TWEEN.Tween(this.rank)
            .to({ alpha: 0 }, 800)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()

        new TWEEN.Tween(this.background)
            .to({ size: 0 }, 800)
            .delay(200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(this.removeSprite.bind(this))
            .start()
    }

    removeSprite () {
        delete this.sn.sprites.summary
    }

    inClose (x, y) {
        let left = this.gapWidth - this.closeSize / 3
        let top = this.gapHeight - this.closeSize / 3

        return x >= left && x <= left + this.closeSize && y >= top && y <= top + this.closeSize
    }

    drawCloseButton (context) {
        if (this.closeImage == undefined) {
            this.closeImage = wx.createImage()
            this.closeImage.src = 'images/close.png'

            this.closeSize = Math.min(this.gapWidth, this.gapHeight) * 1.5
        }

        if (this.background.size < 0.9) {
            return
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

        this.posterDrawRight = this.gapHeight * 2 / 3 + this.posterCanvas.width
        this.posterDrawBottom = this.gapHeight * 2 / 3 + this.posterCanvas.height

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
            .easing(TWEEN.Easing.Bounce.InOut)
            .start()
    }

    drawRank () {
        let canvas = wx.createCanvas()

        canvas.width = 300
        canvas.height = 300

        let context = canvas.getContext('2d')
        
        context.beginPath()

        context.font = `25px Arial`
        context.fillStyle = `rgba(250, 250, 250, ${this.rank.alpha})`

        let rankWidth = context.measureText('评分').width

        context.fillText('评分', 0, 20)
        context.fill()

        context.font = `16px Arial`
        context.fillStyle = `rgba(250, 250, 250, ${this.rank.alpha})`

        context.fillText('（' + this.movie.rank_count + '）', rankWidth + 5, 20)
        context.fill()

        let scoreInteger = Math.floor(this.movie.score)

        context.font = `80px Arial`

        let gradient = context.createLinearGradient(0, 0, 0, 90)
        gradient.addColorStop(0, `rgba(240, 180, 150, ${this.rank.alpha})`)
        gradient.addColorStop(0.8, `rgba(180, 80, 80, ${this.rank.alpha})`)
        gradient.addColorStop(1.0, `rgba(165, 60, 60, ${this.rank.alpha})`)

        context.fillStyle = gradient

        let scoreIntegerWidth = context.measureText(scoreInteger).width

        context.fillText(scoreInteger, 10, 120)
        context.fill()

        let scoreFloat = '.' + this.movie.score * 10 % 10

        context.font = `40px Arial`
        context.fillStyle = gradient

        context.fillText(scoreFloat, 10 + scoreIntegerWidth, 116)
        context.fill()

        context.stroke()

        this.context.drawImage(canvas, this.posterDrawRight + this.gapHeight * 2 / 3, this.gapHeight, canvas.width, canvas.height)
    }

    drawName () {
        let canvas = wx.createCanvas()

        canvas.width = this.canvas.width - this.gapHeight * 4 / 3
        canvas.height = 30

        let context = canvas.getContext('2d')
        
        context.beginPath()

        context.font = `20px Arial`
        context.fillStyle = `rgba(250, 250, 250, ${this.rank.alpha})`

        let nameWidth = context.measureText(this.movie.name).width

        let drawLeft = nameWidth < canvas.width ? canvas.width / 2 - nameWidth / 2 : 0

        context.fillText(this.movie.name, drawLeft, 22)
        context.fill()

        context.stroke()

        this.context.drawImage(canvas, this.gapHeight * 2 / 3, this.posterDrawBottom + this.gapHeight * 2 / 3, canvas.width, canvas.height)

        this.nameDrawBottom = this.posterDrawBottom + this.gapHeight * 2 / 3 + 25
    }

    drawPanels () {
        let canvas = wx.createCanvas()

        canvas.width = this.canvas.width - this.gapHeight * 4 / 3
        canvas.height = this.canvas.height - this.nameDrawBottom- this.gapHeight

        let context = canvas.getContext('2d')

        let drawTop = 0

        for (let i = 0; i < this.movie.panels.length; i++) {
            if (canvas.height - drawTop < 20) {
                break
            }

            context.font = `16px Arial`
            context.fillStyle = `rgba(250, 250, 250, ${this.rank.alpha})`

            context.fillText(this.movie.panels[i], 0, drawTop + 22)
            context.fill()

            drawTop += 30
        }

        this.context.drawImage(canvas, this.gapHeight * 2 / 3, this.nameDrawBottom + this.gapHeight / 3, canvas.width, canvas.height)
    }

    render (canvas, context, time) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.drawBackground()

        if (this.posterCanvas != undefined) {
            this.drawMoviePoster()

            this.drawRank()
            this.drawName()
            this.drawPanels()
        }
        
        super.render(canvas, context, time)

        this.drawCloseButton(context)
    }
}
