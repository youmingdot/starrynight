<?php
namespace App\Foundation\Exceptions;

use Exception;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Lawoole\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        CollapsarException::class
    ];

    /**
     * Render an exception into a response.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Exception $e
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Exception $e)
    {
        if ($e instanceof CollapsarException) {
            return static::getCollapsarExceptionResponse($e);
        } elseif ($e instanceof ValidationException) {
            return static::convertValidationExceptionResponse($e);
        } elseif ($e instanceof HttpException || $e instanceof HttpResponseException) {
            return static::convertHttpExceptionResponse($e);
        } else {
            return static::convertExceptionResponse($e);
        }
    }

    /**
     * Make exception response.
     *
     * @param \App\Foundation\Exceptions\CollapsarException $e
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected static function getCollapsarExceptionResponse(CollapsarException $e)
    {
        return JsonResponse::create([
            'code'    => $e->getCode() ?: 1000,
            'message' => $e->getMessage(),
            'data'    => null
        ], 400);
    }

    /**
     * Make exception response.
     *
     * @param \Illuminate\Validation\ValidationException $e
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected static function convertValidationExceptionResponse(ValidationException $e)
    {
        $errors = $e->validator->errors();
        $message = $errors->first() ?: $e->getMessage();

        return JsonResponse::create([
            'code'    => $e->status,
            'message' => $message,
            'data'    => [
                'errors'    => $errors->messages(),
                'error_bag' => $e->errorBag
            ]
        ], $e->status);
    }

    /**
     * Make exception response.
     *
     * @param \Symfony\Component\HttpKernel\Exception\HttpException|\Illuminate\Http\Exceptions\HttpResponseException $e
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected static function convertHttpExceptionResponse($e)
    {
        $status = $e->getStatusCode();
        $message = isset(Response::$statusTexts[$status]) ? Response::$statusTexts[$status] : 'Unknown';

        return JsonResponse::create([
            'code'    => $status,
            'message' => $message,
            'data'    => null
        ], $status);
    }

    /**
     * Make exception response.
     *
     * @param \Exception $e
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected static function convertExceptionResponse(Exception $e)
    {
        return JsonResponse::create([
            'code'    => 500,
            'message' => 'Internal Server Error',
            'data'    => null
        ], 500);
    }
}
