<?php
namespace App\Http\Controllers;

use Lawoole\Routing\Controller;

class MovieController extends Controller
{
    /**
     * Get the overview of the movie gallery.
     *
     * @return mixed
     */
    public function getGalleryOverview()
    {
        return view('welcome');
    }
}
