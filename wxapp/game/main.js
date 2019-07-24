import TWEEN from '../libs/tween'

import SplashHandler from '../handlers/splash'
import TrekHandler from '../handlers/trek'
import SummaryHandler from '../handlers/summary'

export default class StarryNight {

    constructor () {
        this.initialize()
    }

    initialize () {
        this.baseTime = 0
        this.lastTime = undefined

        this.canvas = canvas
        this.context = this.canvas.getContext('2d')

        this.height = window.innerHeight
        this.width = window.innerWidth

        console.log(`Screen size: ${this.width} x ${this.height} .`)

        this.looper = this.loop.bind(this)

        this.sprites = {}

        this.setHandler(new SplashHandler(this))
    }

    run () {
        window.requestAnimationFrame(this.looper)

        console.log('The Starry Starry Night is running.')
    }

    loop (time) {
        this.baseTime += this.lastTime !== undefined ? time - this.lastTime : 0

        TWEEN.update(this.baseTime)

        this.updateSprites(this.baseTime)

        this.renderSprites(this.baseTime)

        this.lastTime = time

        window.requestAnimationFrame(this.looper)
    }

    updateSprites (time) {
        for (let key in this.sprites) {
            if (this.sprites.hasOwnProperty(key)) {
                this.sprites[key].update(time)
            }
        }
    }

    renderSprites (time) {
        this.renderBackground()

        let sprites = []

        for (let key in this.sprites) {
            if (this.sprites.hasOwnProperty(key)) {
                sprites.push(this.sprites[key])
            }
        }

        sprites.sort(function (a, b) {
            return a.getStackOrder() - b.getStackOrder()
        })

        for (let i = 0; i < sprites.length; i++) {
            sprites[i].render(this.canvas, this.context, time)
        }
    }

    renderBackground () {
        this.context.rect(0, 0, this.width, this.height)
        this.context.fillStyle = '#1e1e1e'
        this.context.fill()
    }

    setHandler (handler) {
        if (this.handler) {
            this.handler.pause()
        }

        this.handler = handler

        this.handler.resume()
    }
}
