<?php
namespace App\Movie;

use Illuminate\Support\ServiceProvider;
use Lawoole\Server\Events\ServerLaunching;

class MovieServiceProvider extends ServiceProvider
{
    /**
     * Register the service.
     */
    public function register()
    {
        $this->registerParser();

        $this->registerManager();
    }

    /**
     * Register the movie parser.
     */
    protected function registerParser()
    {
        $this->app->singleton('movie.parser', function ($app) {
            return new MovieParser($app['console.output.style']);
        });
    }

    /**
     * Register the movie manager.
     */
    protected function registerManager()
    {
        $this->app->singleton('movie', function ($app) {
            $movies = $this->loadMovies($app['movie.parser']);

            return new MovieManager($movies);
        });
    }

    /**
     * Load movies.
     *
     * @param \App\Movie\MovieParser $parser
     *
     * @return \App\Movie\Movie[]
     */
    protected function loadMovies($parser)
    {
        return $parser->file($this->app['config']['movie.gallery']);
    }

    /**
     * Boot the service.
     */
    public function boot()
    {
        $this->app['events']->listen(ServerLaunching::class, function () {
            return $this->app['movie'];
        });
    }
}