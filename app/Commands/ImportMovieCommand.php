<?php
namespace App\Commands;

use Illuminate\Console\Command;

class ImportMovieCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'movie:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import movies from data file';

    /**
     * Execute the command.
     */
    public function handle()
    {
        $fp = fopen(resource_path('movies/gallery.dist.dat'), 'r');

        try {
            $buffer = '';

            while (!feof($fp)) {
                $line = fgets($fp);

                if ($this->isMovieDivider($line)) {
                    //
                    $movie = $this->parse($buffer);

                    if ($movie != null) {
                        $this->info("Movie loaded: {$movie['id']} {$movie['name']}");
                    }

                    $buffer = '';

                    continue;
                }

                $buffer .= $line;
            }
        } finally {
            fclose($fp);
        }
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
     * @return \App\Models\Movie
     */
    public function parse($data)
    {
        $partions = explode('-----', $data, 5);

        if (count($partions) < 5) {
            return null;
        }

        [$title, $keyword, $plane, $rank, $summary] = $partions;

        $title    = $this->parseTitle($title);
        $keywords = $this->parseKeyword($keyword);
        $planes   = $this->parsePlane($plane);
        $ranks    = $this->parseRank($rank);
        $summary  = $this->parseSummary($summary);

        // $this->parseKeyword($movie, $parts[1]);
        // $this->parseInfo($movie, $parts[2]);
        // $this->parseRank($movie, $parts[3]);
        // $this->parseSummary($movie, $parts[4]);

        return $movie;
    }

    /**
     * Parse the data.
     *
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
     * Parse the data.
     *
     * @param string $keyword
     *
     * @return array
     */
    protected function parseKeyword($keyword)
    {
        preg_match_all('/(.+?),(\d+);/u', $keyword, $matches);

        [, $keywords, $counts] = $matches;

        $counts = array_map('intval', $counts);

        return array_combine($keywords, $counts);
    }

    /**
     * Parse the data.
     *
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
     * Parse the data.
     *
     * @param string $rank
     */
    protected function parseRank($rank)
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
     * @param string $summary
     *
     * @return string
     */
    protected function parseSummary($summary)
    {
        $lines = explode("\n", $summary);

        

        return implode("\n", $lines);
    }
}