import Hammer from '../libs/hammer'

export default class Toucher {

    constructor (el) {
        this.hammer = new Hammer(el)

        this.hammer.on('pan', function (e) {
            console.log(e)
        })
    }

}
