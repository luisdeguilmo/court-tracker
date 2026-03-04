<?php

use App\Http\Controllers\BoxController;
use App\Services\OneDriveAppTokenService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Pages ───────────────────────────────────────────────────────────────────

Route::get('/', function () {
    return "Hello";
});

Route::get('/box/auth', function () {
    $url = 'https://account.box.com/api/oauth2/authorize?' . http_build_query([
        'response_type' => 'code',
        'client_id'     => config('services.box.client_id'),
        'redirect_uri'  => config('services.box.redirect_uri'),
    ]);

    return redirect($url);
});

// Route::get('/box/callback', function (Request $request) {
//     $code = $request->query('code');

//     if (!$code) {
//         return redirect('/')->with('error', 'No authorization code returned from Box.');
//     }

//     try {
//         $response = Http::withOptions([
//             'verify'  => false,   // disable SSL verification for local dev
//             'timeout' => 30,
//         ])
//         ->asForm()
//         ->post('https://api.box.com/oauth2/token', [
//             'grant_type'    => 'authorization_code',
//             'code'          => $code,
//             'client_id'     => config('services.box.client_id'),
//             'client_secret' => config('services.box.client_secret'),
//             'redirect_uri'  => config('services.box.redirect_uri'),
//         ]);

//         $data = $response->json();

//         if (isset($data['error'])) {
//             return redirect('/')->with('error', $data['error_description'] ?? $data['error']);
//         }

//         session([
//             'box_access_token'  => $data['access_token'],
//             'box_refresh_token' => $data['refresh_token'],
//         ]);

//         return redirect('/box/files');

//     } catch (\Exception $e) {
//         return redirect('/')->with('error', 'Box connection failed: ' . $e->getMessage());
//     }
// });

Route::get('/box/callback', function (Request $request) {
    $code = $request->query('code');
    $state = $request->query('state');

    // Dump everything to see what's coming in
    if (!$code) {
        dd('NO CODE RECEIVED', $request->all());
    }

    dd('CODE RECEIVED', [
        'code'  => $code,
        'state' => $state,
        'all'   => $request->all(),
    ]);
});

Route::get('/box/files/{folderId?}', [BoxController::class, 'index']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
});

Route::get('/settings', function () {
    return Inertia::render('Settings');
});


