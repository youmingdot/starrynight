<?php
namespace App\Movie;

use App\Contracts\Movie\Gallery;

class MovieManager implements Gallery
{
    /**
     * All movies.
     *
     * @var \App\Movie\Movie[]
     */
    protected $movies = [];

    /**
     * Create a movie manager instance.
     *
     * @param \App\Movie\Movie[] $movies
     */
    public function __construct($movies)
    {
        $this->movies = $movies;
    }

    public function getMovieCount()
    {
    }

    /**
     * Search movies in the gallery.
     *
     * @param string $keyword
     * @param int $page
     * @param int $pageSize
     *
     * @return array
     */
    public function searchMovie($keyword, $page = 1, $pageSize = 20)
    {
    }

    /**
     * Get the detail of the movie.
     *
     * @param string $movieId
     *
     * @return array
     */
    public function getMovieDetail($movieId)
    {
    }
}