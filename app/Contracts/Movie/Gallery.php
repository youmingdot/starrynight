<?php
namespace App\Contracts\Movie;

interface Gallery
{
    public function getMovieCount();

    /**
     * Search movies in the gallery.
     *
     * @param string $keyword
     * @param int $page
     * @param int $pageSize
     *
     * @return array
     */
    public function searchMovie($keyword, $page = 1, $pageSize = 20);

    /**
     * Get the detail of the movie.
     *
     * @param string $movieId
     *
     * @return array
     */
    public function getMovieDetail($movieId);
}