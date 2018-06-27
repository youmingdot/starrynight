<?php
namespace App\Movie;

class MovieParser
{
    /**
     * The console output.
     *
     * @var \Lawoole\Console\OutputStyle
     */
    protected $output;

    /**
     * Create a movie parser.
     *
     * @param \Illuminate\Console\OutputStyle $output
     */
    public function __construct($output)
    {
        $this->output = $output;
    }

    /**
     * Parse movies from the given file.
     *
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

            while (!feof($fp)) {
                $line = fgets($fp);

                if ($this->isMovieDivider($line)) {
                    //
                    $movie = $this->parse($buffer);

                    if ($movie != null) {
                        $movies[$movie->getId()] = $movie;

                        $this->output->info("Movie loaded: {$movie->getId()} {$movie->getName()}");
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
     * Return whether the line is movie divider.
     *
     * @param string $line
     *
     * @return bool
     */
    protected function isMovieDivider($line)
    {
        return trim($line) == '=*******=';
    }

    /**
     * Parse the data to a movie instance.
     *
     * @param string $data
     *
     * @return \App\Movie\Movie
     */
    public function parse($data)
    {
        $movie = new Movie;

        $parts = explode('-----', $data, 5);

        if (count($parts) < 5) {
            return null;
        }

        $this->parseTitle($movie, $parts[0]);
        $this->parseKeyword($movie, $parts[0]);
        $this->parseInfo($movie, $parts[0]);
        $this->parseRank($movie, $parts[0]);
        $this->parseSummary($movie, $parts[0]);

        return $movie;
    }

    /**
     * Parse the data.
     *
     * @param \App\Movie\Movie $movie
     * @param string $data
     */
    protected function parseTitle($movie, $data)
    {
        [$id, $title] = explode(':', $data);
        [$name, $year] = strpos($title, ',') !== false ? explode(',', $title) : [$title, ''];

        $year = $this->extractArgument('/\((\d+)\)/u', $year);

        $movie->setId($id);
        $movie->setName($name);
        $movie->setYear($year);
    }

    /**
     * Parse the data.
     *
     * @param \App\Movie\Movie $movie
     * @param string $data
     */
    protected function parseKeyword($movie, $data)
    {
        $keywords = [];

        foreach (explode(';', $data) as $row) {
            if (strpos($row, ',') === false) {
                continue;
            }

            [$keyword, $amount] = explode(',', $row);

            $keywords[$keyword] = (int) $amount;
        }

        $movie->setKeywords($keywords);
    }

    /**
     * Parse the data.
     *
     * @param \App\Movie\Movie $movie
     * @param string $data
     */
    protected function parseInfo($movie, $data)
    {
        $info = explode("\n", $data);

        $info = array_filter($info, function ($info) {
            return strpos($info, ':') !== false;
        });

        $info = array_map(function ($info) {
            return explode(':', $info, 2);
        }, $info);

        foreach ($info as $item) {
            [$key, $value] = $item;

            switch ($key) {
                case '导演':
                    $movie->setDirectors(array_map('trim', explode('/', $value)));
                    break;
                case '编剧':
                    $movie->setScriptwriters(array_map('trim', explode('/', $value)));
                    break;
                case '主演':
                    $movie->setActors(array_map('trim', explode('/', $value)));
                    break;
                case '类型':
                    $movie->setTypes(array_map('trim', explode('/', $value)));
                    break;
                case '语言':
                    $movie->setLanguages(array_map('trim', explode('/', $value)));
                    break;
                case '片长':
                    $movie->setLength(str_replace('分钟', '', trim($value)));
                    break;
            }
        }
    }

    /**
     * Parse the data.
     *
     * @param \App\Movie\Movie $movie
     * @param string $data
     */
    protected function parseRank($movie, $data)
    {
        $ranks = explode("\n", $data);

        $movie->setScore(trim($ranks[0]));

        $rankCount = $this->extractArgument('/(\d+)人评价/u', $ranks[1]);

        $movie->setRankCount($rankCount);

        $ranks = array_map(function ($rank) {
            return $this->extractArgument('/(\d+)%/u', $rank);
        }, array_slice($ranks, 2));

        $movie->setRanks($ranks);
    }

    /**
     * Parse the data.
     *
     * @param \App\Movie\Movie $movie
     * @param string $data
     */
    protected function parseSummary($movie, $data)
    {

    }

    /**
     * Get argument value.
     *
     * @param string $pattern
     * @param string $value
     *
     * @return string
     */
    protected function extractArgument($pattern, $value)
    {
        preg_match($pattern, $value, $matches);

        return $matches[1] ?? null;
    }
}