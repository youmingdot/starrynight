

let instance

export default class ViewState {

    constructor () {
        if (instance) {
            return instance
        }

        instance = this

        this.initialize()
    }

    initialize () {

    }
}
