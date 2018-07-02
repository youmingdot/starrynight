
export default class Handler {

    constructor (sn) {
        this.sn = sn

        this.effecting = false
        this.toucher = undefined

        this.initialize()
    }

    initialize () {
        //
    }

    isEffecting () {
        return this.effecting
    }

    pause () {
        this.effecting = false

        this.toucher.pause()
    }

    resume () {
        this.effecting = true

        this.toucher.resume()
    }

}
