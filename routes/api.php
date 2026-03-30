<?php

use App\Http\Controllers\BoxTokenController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::get('/box/file-token/{fileId}', function ($fileId) {
//     try {
//         $token = config('services.box.access_token'); // server-only

//         // Example: you might need to call Box API to generate a short-lived token
//         // For demo, just return server token
//         return response()->json([
//             'accessToken' => $token,
//             'expires_in' => 3600,
//         ]);
//     } catch (\Exception $e) {
//         return response()->json([
//             'error' => $e->getMessage()
//         ], 500);
//     }
// });


// Route::middleware('auth')->group(function () {
//     Route::get('/box/file-token/{fileId}', [BoxTokenController::class, 'show'])
//         ->middleware('throttle:30,1');
// });