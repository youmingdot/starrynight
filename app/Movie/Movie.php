<?php
namespace App\Movie;

use Illuminate\Support\Arr;

class Movie
{
    /**
     * The identify of the movie.
     *
     * @var string
     */
    protected $id;

    /**
     * The movie name.
     *
     * @var string
     */
    protected $name;

    /**
     * The year that movie shown.
     *
     * @var int
     */
    protected $year;

    /**
     * All movie directors.
     *
     * @var array
     */
    protected $directors = [];

    /**
     * All movie scriptwriters.
     *
     * @var array
     */
    protected $scriptwriters = [];

    /**
     * All leading actors.
     *
     * @var array
     */
    protected $actors = [];

    /**
     * All movie types.
     *
     * @var array
     */
    protected $types = [];

    /**
     * Keywords.
     *
     * @var array
     */
    protected $keywords = [];

    /**
     * Ranked score.
     *
     * @var float
     */
    protected $score;

    /**
     * The ranking detail.
     *
     * @var array
     */
    protected $ranks = [];

    /**
     * The amount of ranks.
     *
     * @var array
     */
    protected $rankCount;

    /**
     * The summary of the story.
     *
     * @var string
     */
    protected $summary;

    /**
     * The length of the movie.
     *
     * @var int
     */
    protected $length;

    /**
     * Supported languages.
     *
     * @var array
     */
    protected $languages = [];

    /**
     * Create a movie instance.
     *
     * @param string $id
     */
    public function __construct($id = null)
    {
        if ($id !== null) {
            $this->setId($id);
        }
    }

    /**
     * Get the identify of the movie.
     *
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the identify of the movie.
     *
     * @param string $id
     *
     * @return $this
     */
    public function setId($id)
    {
        $this->id = trim($id);

        return $this;
    }

    /**
     * Get the movie name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set the name of the movie.
     *
     * @param string $name
     */
    public function setName($name)
    {
        $name = htmlspecialchars_decode($name, ENT_QUOTES);

        $this->name = trim($name);
    }

    /**
     * Get the year that movie shown.
     *
     * @return int
     */
    public function getYear()
    {
        return $this->year;
    }

    /**
     * Set the year that movie shown.
     *
     * @param int $year
     *
     * @return $this
     */
    public function setYear($year)
    {
        $this->year = (int) $year;

        return $this;
    }

    /**
     * Get all movie directors.
     *
     * @return array
     */
    public function getDirectors()
    {
        return $this->directors;
    }

    /**
     * Set movie directors.
     *
     * @param array $directors
     *
     * @return $this
     */
    public function setDirectors($directors)
    {
        $directors = Arr::wrap($directors);

        $this->directors = array_map('trim', $directors);

        return $this;
    }

    /**
     * Get all movie scriptwriters.
     *
     * @return array
     */
    public function getScriptwriters()
    {
        return $this->scriptwriters;
    }

    /**
     * Set movie scriptwriters.
     *
     * @param array $scriptwriters
     *
     * @return $this
     */
    public function setScriptwriters($scriptwriters)
    {
        $scriptwriters = Arr::wrap($scriptwriters);

        $this->scriptwriters = array_map('trim', $scriptwriters);

        return $this;
    }

    /**
     * Get all leading actors.
     *
     * @return array
     */
    public function getActors()
    {
        return $this->actors;
    }

    /**
     * Set leading actors.
     *
     * @param array $actors
     *
     * @return $this
     */
    public function setActors($actors)
    {
        $actors = Arr::wrap($actors);

        $this->actors = array_map('trim', $actors);

        return $this;
    }

    /**
     * Get all movie types.
     *
     * @return array
     */
    public function getTypes()
    {
        return $this->types;
    }

    /**
     * Set movie types.
     *
     * @param array $types
     *
     * @return $this
     */
    public function setTypes($types)
    {
        $types = Arr::wrap($types);

        $this->types = array_map('trim', $types);

        return $this;
    }

    /**
     * Get all keywords of the movie.
     *
     * @return array
     */
    public function getKeywords()
    {
        return $this->keywords;
    }

    /**
     * Set the keywords.
     *
     * @param array $keywords
     *
     * @return $this
     */
    public function setKeywords($keywords)
    {
        $keywords = Arr::wrap($keywords);

        $this->keywords = array_map('trim', $keywords);

        return $this;
    }

    /**
     * Get ranked score.
     *
     * @return float
     */
    public function getScore()
    {
        return $this->score;
    }

    /**
     * Set ranked score.
     *
     * @param float $score
     *
     * @return $this
     */
    public function setScore($score)
    {
        $this->score = (float) $score;

        return $this;
    }

    /**
     * Get ranking detail.
     *
     * @return array
     */
    public function getRanks()
    {
        return $this->ranks;
    }

    /**
     * Set ranking detail.
     *
     * @param array $ranks
     *
     * @return $this
     */
    public function setRanks($ranks)
    {
        $ranks = Arr::wrap($ranks);

        $this->ranks = array_map(function ($rank) {
            return (float) trim(trim($rank), '%');
        }, $ranks);

        return $this;
    }

    /**
     * Get the amount of ranks.
     *
     * @return array
     */
    public function getRankCount()
    {
        return $this->rankCount;
    }

    /**
     * Set the amount of ranks.
     *
     * @param int $rankCount
     *
     * @return $this
     */
    public function setRankCount($rankCount)
    {
        $this->rankCount = (int) $rankCount;

        return $this;
    }

    /**
     * Get movie summary.
     *
     * @return string
     */
    public function getSummary()
    {
        return $this->summary;
    }

    /**
     * Set movie summary.
     *
     * @param string $summary
     *
     * @return $this
     */
    public function setSummary($summary)
    {
        $this->summary = $summary;

        return $this;
    }

    /**
     * Get the length of the movie.
     *
     * @return int
     */
    public function getLength()
    {
        return $this->length;
    }

    /**
     * Set the length of the movie.
     *
     * @param int $length
     *
     * @return $this
     */
    public function setLength($length)
    {
        $this->length = (int) $length;

        return $this;
    }

    /**
     * Get movie supported languages.
     *
     * @return array
     */
    public function getLanguages()
    {
        return $this->languages;
    }

    /**
     * Set movie supported languages.
     *
     * @param array $languages
     *
     * @return $this
     */
    public function setLanguages($languages)
    {
        $languages = Arr::wrap($languages);

        $this->languages = array_map('trim', $languages);

        return $this;
    }
}