import TWEEN from '../libs/tween'

import SplashHandler from '../handlers/splash'
import TrekHandler from '../handlers/trek'

export default class StarryNight {

    constructor () {
        this.initialize()
    }

    initialize () {
        this.canvas = canvas
        this.context = this.canvas.getContext('2d')

        this.height = window.innerHeight
        this.width = window.innerWidth

        console.log(`Screen size: ${this.width} x ${this.height} .`)

        this.looper = this.loop.bind(this)

        this.setHandler(new SplashHandler(this))
    }

    run () {
        window.requestAnimationFrame(this.looper)

        console.log('The Starry Starry Night is running.')
    }

    loop (time) {
        TWEEN.update(time)

        this.updateSprites(time)

        this.renderSprites(time)

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

        let sprites = this.sprites

        sprites.sort(function (a, b) {
            return a.getStackOrder() - b.getStackOrder()
        })

        for (let key in sprites) {
            if (this.sprites.hasOwnProperty(key) && this.sprites[key].isVisible()) {
                this.sprites[key].render(this.canvas, this.context, time)
            }
        }
    }

    renderBackground () {
        this.context.rect(0, 0, this.width, this.height)
        this.context.fillStyle = '#0f0f0f'
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
