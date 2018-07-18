<?php
namespace App\Movie;

use Illuminate\Support\Arr;

class Movie
{
    /**
     * @var int
     */
    protected $id;

    /**
     * @var string
     */
    protected $no;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var array
     */
    protected $panels = [];

    /**
     * @var array
     */
    protected $keywords = [];

    /**
     * @var float
     */
    protected $score;

    /**
     * @var array
     */
    protected $ranks = [];

    /**
     * @var array
     */
    protected $rankCount;

    /**
     * @var string
     */
    protected $summary;

    /**
     * @param string $id
     */
    public function __construct($id = null)
    {
        if ($id !== null) {
            $this->setId($id);
        }
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     *
     * @return $this
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return string
     */
    public function getNo()
    {
        return $this->no;
    }

    /**
     * @param string $no
     *
     * @return $this
     */
    public function setNo($no)
    {
        $this->no = trim($no);

        return $this;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $name = htmlspecialchars_decode($name, ENT_QUOTES);

        $this->name = trim($name);
    }

    /**
     * @return array
     */
    public function getPanels()
    {
        return $this->panels;
    }

    /**
     * @param array $panels
     *
     * @return $this
     */
    public function setPanels($panels)
    {
        $panels = Arr::wrap($panels);

        $this->panels = array_map('trim', $panels);

        return $this;
    }

    /**
     * @return array
     */
    public function getKeywords()
    {
        return $this->keywords;
    }

    /**
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
     * @return float
     */
    public function getScore()
    {
        return $this->score;
    }

    /**
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
     * @return array
     */
    public function getRanks()
    {
        return $this->ranks;
    }

    /**
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
     * @return array
     */
    public function getRankCount()
    {
        return $this->rankCount;
    }

    /**
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
     * @return string
     */
    public function getSummary()
    {
        return $this->summary;
    }

    /**
     * @param string $summary
     *
     * @return $this
     */
    public function setSummary($summary)
    {
        $this->summary = $summary;

        return $this;
    }
}