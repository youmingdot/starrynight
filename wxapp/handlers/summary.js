import Toucher from '../game/toucher'
import Handler from 'handler'

import SummarySprite from '../sprites/summary'

class SummaryToucher extends Toucher {

    initialize () {
        this.hammer.on('tap', this.onTap.bind(this), { time: 1000 })
    }

    onTap (event) {
        this.handler.onTap(event.center.x, event.center.y)
    }
}

export default class SummaryHandler extends Handler {

    setTrekHandler (trek) {
        this.trek = trek
    }

    initialize () {
        super.initialize()

        this.toucher = new SummaryToucher(this)

        this.summary = new SummarySprite(this.sn)

        this.sn.sprites.summary = this.summary
    }

    onTap (x, y) {
        if (this.summary.inClose(x, y)) {
            this.summary.doClose()

            this.sn.setHandler
        }
    }

    showMovie (movieId) {
        this.movieId = movieId

        wx.request({
            method: 'GET',
            url: `https://api.ymdot.cn/gallery/movie.json?id=${movieId}`,
            dataType: 'json',
            success: this.showMovieInfo.bind(this)
        })
    }

    showMovieInfo (result) {
        let movie = result.data.data.movie

        console.log(movie)

        this.summary.setMovie(movie)

        wx.downloadFile({
            url: `https://api.ymdot.cn/images/poster/${movie.no}.jpg`,
            success: this.showMoviePoster.bind(this)
        })
    }

    showMoviePoster (result) {
        let filePath = result.tempFilePath

        this.summary.setMoviePoster(filePath)
    }

    pause () {
        super.pause()

        this.toucher.pause()
    }

    resume () {
        super.resume()

        this.toucher.resume()
    }
}
