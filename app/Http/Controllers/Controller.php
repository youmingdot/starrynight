<?php
namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /**
     * The application instance.
     *
     * @var \Illuminate\Contracts\Foundation\Application
     */
    protected $app;

    /**
     * Create a controller instance.
     *
     * @param \Illuminate\Contracts\Foundation\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Send success response.
     *
     * @param mixed $data
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function success($data = null)
    {
        return JsonResponse::create([
            'code'    => 0,
            'message' => 'Success',
            'data'    => $data
        ]);
    }
}