<?php

namespace App\Http\Controllers;

use App\Services\BoxService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class BoxProxyController extends Controller
{
    public function proxy(Request $request, string $path, BoxService $box)
    {
        // $accessToken = session('box_access_token'); // however you store it

        // $tokens = $box->getAccessToken($request->get('code'));

        // $response = Http::withoutVerifying()->withToken($tokens['access_token'])
        //     ->withOptions(['query' => $request->query()])
        //     ->send($request->method(), "https://api.box.com/2.0/{$path}");

        // return response($response->body(), $response->status())
        //     ->header('Content-Type', $response->header('Content-Type'));
    }
}
