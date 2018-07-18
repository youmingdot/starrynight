<?php
namespace App\Movie;

use Illuminate\Support\Str;

class MovieParser
{
    /**
     * @var \Lawoole\Console\OutputStyle
     */
    protected $output;

    /**
     * @param \Illuminate\Console\OutputStyle $output
     */
    public function __construct($output)
    {
        $this->output = $output;
    }

    /**
     * @param string $path
     *
     * @return \App\Movie\Movie[]
     */
    public function file($path)
    {
        $movies = [];

        $fp = fopen($path, 'r');

        try {
            $buffer = '';

            $sequence = 1;

            while (!feof($fp)) {
                $line = fgets($fp);

                if ($this->isMovieDivider($line)) {
                    if ($movie = $this->parse($buffer)) {
                        $movie->setId($sequence);

                        $movies[$movie->getId()] = $movie;

                        $this->output->info("Movie loaded: {$movie->getNo()} {$movie->getName()}");

                        $sequence ++;
                    }

                    $buffer = '';

                    continue;
                }

                $buffer .= $line;
            }
        } finally {
            fclose($fp);
        }

        return $movies;
    }

    /**
     * @param string $line
     *
     * @return bool
     */
    protected function isMovieDivider($line)
    {
        return trim($line) == '=*******=';
    }

    /**
     * @param string $data
     *
     * @return \App\Movie\Movie
     */
    public function parse($data)
    {
        $partions = explode('-----', $data, 5);

        if (count($partions) < 5) {
            return null;
        }

        [$title, $keyword, $plane, $rank, $summary] = $partions;

        $title = $this->parseTitle($title);
        $keywords = $this->parseKeyword($keyword);
        $planes = $this->parsePlane($plane);
        $ranks = $this->parseRank($rank);
        $summary = $this->parseSummary($summary);

        $movie = new Movie;

        $movie->setNo($title['no']);
        $movie->setName($title['name']);
        $movie->setKeywords($keywords);
        $movie->setPanels($planes);
        $movie->setScore($ranks['score']);
        $movie->setRanks($ranks['ranks']);
        $movie->setRankCount($ranks['amount']);
        $movie->setSummary($summary);

        return $movie;
    }

    /**
     * @param string $title
     *
     * @return array
     */
    protected function parseTitle($title)
    {
        preg_match('/^(\d+):(.+?),.+$/u', $title, $matches);

        [, $no, $name] = $matches;

        return compact('no', 'name');
    }

    /**
     * @param string $keyword
     *
     * @return array
     */
    protected function parseKeyword($keyword)
    {
        preg_match_all('/(.+?),(\d+);/u', $keyword, $matches);

        [, $keywords, $counts] = $matches;

        $counts = array_map(function ($count) {
            return (int) $count;
        }, $counts);

        return array_combine($keywords, $counts);
    }

    /**
     * @param string $plane
     *
     * @return array
     */
    protected function parsePlane($plane)
    {
        $planes = explode("\n", $plane);

        $planes = array_map('trim', $planes);

        return array_values(array_filter($planes));
    }

    /**
     * @param string $rank
     *
     * @return array
     */
    protected function parseRank($rank)
    {
        $ranks = explode("\n", $rank);

        $ranks = array_map('trim', $ranks);

        $ranks = array_values(array_filter($ranks));

        $score = (float) array_shift($ranks);

        $amount = $this->extractArguments('/(\d+)/u', array_shift($ranks));
        $amount = $amount ? $amount[0] : 0;

        $ranks = array_map(function ($rank) {
            return (float) $this->extractArguments('/([.\d]+)%/u', $rank)[0];
        }, $ranks);

        $ranks = count($ranks) == 5 ? array_combine([5, 4, 3, 2, 1], $ranks) : [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];

        return compact('score', 'amount', 'ranks');
    }

    /**
     * @param string $summary
     *
     * @return string
     */
    protected function parseSummary($summary)
    {
        $lines = explode("\n", $summary);

        $summary = '';

        foreach ($lines as $line) {
            $line = trim($line, "\t\n\r");

            if (empty($line)) {
                continue;
            }

            if (!Str::startsWith($line, '    ')) {
                $summary = '';
                continue;
            }

            $summary .= trim($line)."\n";
        }

        return trim($summary);
    }

    /**
     * @param string $pattern
     * @param string $subject
     *
     * @return mixed
     */
    protected function extractArguments($pattern, $subject)
    {
        preg_match($pattern, $subject, $matches);

        array_shift($matches);

        return $matches;
    }
}