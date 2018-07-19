<?php
namespace App\Movie;

use App\Contracts\Movie\Gallery;
use Illuminate\Support\Collection;

class MovieManager implements Gallery
{
    /**
     * @var \App\Movie\Movie[]
     */
    protected $movies = [];

    /**
     * @var array
     */
    protected $movieNos = [];

    /**
     * @var array
     */
    protected $keywords = [];

    /**
     * Create a movie manager instance.
     *
     * @param \App\Movie\Movie[] $movies
     */
    public function __construct($movies)
    {
        $this->movies = $movies;

        $this->movieNos = Collection::make($movies)->mapWithKeys(function ($movie) {
            return [$movie->getNo() => $movie->getId()];
        })->all();

        $this->parseKeywords($movies);
    }

    /**
     * @param \App\Movie\Movie[] $movies
     */
    protected function parseKeywords($movies)
    {
        $this->keywords = [];

        foreach ($movies as $movie) {
            $movieId = $movie->getId();
            $keywords = $movie->getKeywords();

            foreach ($keywords as $keyword => $count) {
                $this->keywords[$keyword][$movieId] = $count;
            }
        }
    }

    /**
     * @return int
     */
    public function getMovieCount()
    {
        return count($this->movies);
    }

    /**
     * @param string $keyword
     * @param int $page
     * @param int $pageSize
     *
     * @return array
     */
    public function searchMovie($keyword, $page = 1, $pageSize = 20)
    {
        if (isset($this->keywords[$keyword])) {
            $keywords = $this->keywords[$keyword];

            arsort($keywords);

            $movieIds = array_slice(array_keys($keywords), ($page - 1) * $pageSize, $pageSize);

            $movies = [];

            foreach ($movieIds as $movieId) {
                $movie = $this->movies[$movieId];

                $movies[] = [
                    'id'         => $movie->getId(),
                    'no'         => $movie->getNo(),
                    'name'       => $movie->getName(),
                    'keywords'   => $movie->getKeywords(),
                    'panels'     => $movie->getPanels(),
                    'score'      => $movie->getScore(),
                    'ranks'      => $movie->getRanks(),
                    'rank_count' => $movie->getRankCount(),
                    'summary'    => $movie->getSummary(),
                ];
            }

            $count = count($keywords);
        }

        return [
            'movies' => $movies ?? [],
            'count'  => $count ?? 0,
        ];
    }

    /**
     * @param int $movieId
     *
     * @return array
     */
    public function getMovieDetail($movieId)
    {
        if (!isset($this->movies[$movieId])) {
            return null;
        }

        $movie = $this->movies[$movieId];

        return [
            'id'         => $movie->getId(),
            'no'         => $movie->getNo(),
            'name'       => $movie->getName(),
            'keywords'   => $movie->getKeywords(),
            'panels'     => $movie->getPanels(),
            'score'      => $movie->getScore(),
            'ranks'      => $movie->getRanks(),
            'rank_count' => $movie->getRankCount(),
            'summary'    => $movie->getSummary(),
        ];
    }

    /**
     * @param string $movieNo
     *
     * @return array
     */
    public function getMovieDetailByNo($movieNo)
    {
        if (!isset($this->movieNos[$movieNo])) {
            return null;
        }

        $movieId = $this->movieNos[$movieNo];

        return $this->getMovieDetail($movieId);
    }

    /**
     * @param string $movieNo
     *
     * @return array
     */
    public function getMovieGuessQuestion($movieNo = null)
    {
        $movieNo = $movieNo ?? array_rand($this->movieNos);

        $movie = $this->getMovieDetailByNo($movieNo);

        $movie = array_only($movie, ['id', 'no', 'name', 'keywords', 'score']);

        $movie['right'] = true;

        $movieIds = array_rand($this->movieNos, 6);

        $choices = [$movie];

        foreach ($movieIds as $movieId) {
            $m = $this->getMovieDetailByNo($movieId);

            $m = array_only($m, ['id', 'no', 'name', 'keywords', 'score']);

            if ($movie['no'] == $m['no']) {
                continue;
            }

            $m['right'] = false;

            $choices[] = $m;

            if (count($choices) >= 4) {
                break;
            }
        }

        shuffle($choices);

        return [
            'movie' => $movie,
            'choices' => $choices
        ];
    }
}