<?php
namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    /**
     * @var \App\Movie\MovieManager
     */
    protected $mMovie;

    /**
     * @param \Illuminate\Contracts\Foundation\Application $app
     */
    public function __construct(Application $app)
    {
        parent::__construct($app);

        $this->mMovie = $app['movie'];
    }

    /**
     * @return mixed
     */
    public function getGalleryOverview()
    {
        return $this->success(['count' => $this->mMovie->getMovieCount()]);
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return mixed
     */
    public function getMovieDetail(Request $request)
    {
        if ($movieId = $request->query('id')) {
            $movie = $this->mMovie->getMovieDetail($movieId);
        } else {
            $movie = $this->mMovie->getMovieDetailByNo($request->query('no'));
        }

        return $this->success(['movie' => $movie]);
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return mixed
     */
    public function getMovieGuessQuestion(Request $request)
    {
        $movieNo = $request->query('no');

        $question = $this->mMovie->getMovieGuessQuestion($movieNo);

        return $this->success(['question' => $question]);
    }
}
