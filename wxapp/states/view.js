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
        this.name = 'The Starry Starry Night'

        this.splashing = false

        this.initializeMovieSummary()
    }

    initializeMovieSummary () {
        this.movieSummary = {
            visible: false
        }
    }

}
