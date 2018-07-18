<?php
namespace App\Movie;

use Illuminate\Support\ServiceProvider;
use Lawoole\Server\Events\ServerLaunching;

class MovieServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->registerParser();

        $this->registerManager();
    }

    protected function registerParser()
    {
        $this->app->singleton('movie.parser', function ($app) {
            return new MovieParser($app['console.output.style']);
        });
    }

    protected function registerManager()
    {
        $this->app->singleton('movie', function ($app) {
            $movies = $this->loadMovies($app['movie.parser']);

            return new MovieManager($movies);
        });
    }

    /**
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