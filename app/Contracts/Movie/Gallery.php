<?php
namespace App\Contracts\Movie;

interface Gallery
{
    /**
     * @return int
     */
    public function getMovieCount();

    /**
     * @param string $keyword
     * @param int $page
     * @param int $pageSize
     *
     * @return array
     */
    public function searchMovie($keyword, $page = 1, $pageSize = 20);

    /**
     * @param string $movieId
     *
     * @return array
     */
    public function getMovieDetail($movieId);
}