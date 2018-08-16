import * as THREE from '../libs/three'
import TWEEN from '../libs/tween'

import TrekHandler from '../handlers/trek'

import Sprite from 'sprite'

const SAYS_SIZE = 56

const SAYS_IMAGES = [
    '愿你的微光',
    '能够闪烁出',
    '这夏夜里',
    '最微小的',
    '美梦'
]

export default class SplashSprite extends Sprite {

    initialize () {
        super.initialize()

        this.stackOrder = 9

        this.initializeSays()

        this.setVisible(true)

        this.startSaying()
    }

    initializeSays () {
        this.sayings = []

        for (let i = 0; i < SAYS_IMAGES.length; i++) {
            this.sayings[i] = {
                y: this.sn.width / 2,
                alpha: 0
            }
        }
    }

    drawSay (say, size, alpha) {
        let canvas = wx.createCanvas()

        canvas.width = this.sn.width * 2
        canvas.height = size * 2.8

        let context = canvas.getContext('2d')

        // context.imageSmoothingQuality = 'high'
        
        context.beginPath()
        context.font = `${size}px Arial`
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`

        let measure = context.measureText(say)

        context.fillText(say, canvas.width / 2 - measure.width / 2, size)
        context.fill()
        context.stroke()

        return canvas
    }

    startSaying () {
        for (let i = 0; i < SAYS_IMAGES.length; i++) {
            this.sayings[i].y = this.sn.width * 3 / 5 + this.sn.width / 6
            this.sayings[i].alpha = 0

            let showTween = new TWEEN.Tween(this.sayings[i])
                .to({ y: this.sn.width * 3 / 5, alpha: 1 }, 1500)
                .delay(i * 2500 + 2500)
                .easing(TWEEN.Easing.Quadratic.Out)

            let hideTween = new TWEEN.Tween(this.sayings[i])

            if (i < SAYS_IMAGES.length - 1) {
                hideTween.to({ y: this.sn.width * 3 / 5 - this.sn.width / 6, alpha: 0 }, 1500)
                    .delay(500)
                    .easing(TWEEN.Easing.Quadratic.In)

                if (i == SAYS_IMAGES.length - 2) {
                    hideTween.onStart(this.showStarry.bind(this))
                }
            } else {
                hideTween.to({ alpha: 0 }, 2500)
                    .delay(500)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .onComplete(this.hideSplash.bind(this))
            }

            showTween.chain(hideTween)

            showTween.start()
        }
    }

    showStarry () {
        this.sn.setHandler(new TrekHandler(this.sn))
    }

    hideSplash () {
        delete this.sn.sprites.splash
    }

    render (canvas, context, time) {
        super.render(canvas, context, time)

        for (let i = 0; i < SAYS_IMAGES.length; i++) {
            let saying = this.sayings[i]

            if (saying.alpha <= 0) {
                continue
            }

            let sayCanvas = this.drawSay(SAYS_IMAGES[i], SAYS_SIZE, saying.alpha)

            context.drawImage(sayCanvas, 0, saying.y, sayCanvas.width / 2, sayCanvas.height / 2)
        }
    }
}
