import Toucher from '../game/toucher'
import Handler from 'handler'

import SummarySprite from '../sprites/summary'

class SummaryToucher extends Toucher {

    initialize () {
        
    }

}

export default class SummaryHandler extends Handler {

    initialize () {
        super.initialize()

        this.toucher = new SummaryToucher(this)

        this.summary = new SummarySprite(this.sn)

        this.sn.sprites.summary = this.summary
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
}
