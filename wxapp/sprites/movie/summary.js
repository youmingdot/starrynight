import Sprite from '../sprite'

import ViewState from '../../states/view'

let viewState = new ViewState()

export default class MovieSummarySprite extends Sprite {

    render () {
        if (viewState.movieSummary.visible !== true) {
            return
        }

        this.sn.ctx.fillStyle = 'yellow';
        this.sn.ctx.fillRect(50, 50, 200, 100);
    }

}
