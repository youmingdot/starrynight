<?php
namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Request;

class SearchController extends Controller
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
     * @param \Illuminate\Http\Request $request
     *
     * @return mixed
     */
    public function searchMovie(Request $request)
    {
        $keyword = $request->query('keyword');

        return $this->success($this->mMovie->searchMovie($keyword));
    }
}