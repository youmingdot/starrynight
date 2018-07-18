import canvas from '../libs/weapp-adapter'

import TWEEN from '../libs/tween'

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

        this.sprites = {}
    }

    run () {
        window.requestAnimationFrame(this.looper)

        console.log('The Starry Starry Night is running.')
    }

    loop (time) {
        TWEEN.update(time)

        this.updateHandler(time)

        this.updateSprites(time)

        this.renderSprites(time)

        window.requestAnimationFrame(this.looper)
    }

    updateHandler (time) {

    }

    updateSprites (time) {
        for (let key in this.sprites) {
            if (this.sprites.hasOwnProperty(key)) {
                this.sprites[key].update(time)
            }
        }
    }

    renderSprites (time) {
        let sprites = this.sprites

        sprites.sort(function (a, b) {
            return a.getZIndex() - b.getZIndex()
        })

        for (let key in sprites) {
            if (this.sprites.hasOwnProperty(key) && this.sprites[key].isVisible()) {
                this.sprites[key].render(this.canvas, time)
            }
        }
    }

    setHandler (handler) {
        if (this.handler) {
            this.handler.stop()
        }

        this.handler = handler

        this.handler.start()
    }


}
