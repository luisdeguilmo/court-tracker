<?php

use App\Services\OneDriveAppTokenService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Pages ───────────────────────────────────────────────────────────────────

Route::get('/', function () {
    return "Hello";
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
});

Route::get('/settings', function () {
    return Inertia::render('Settings');
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateCodeVerifier(): string {
    return rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
}

function generateCodeChallenge(string $verifier): string {
    return rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '=');
}

// ─── OneDrive OAuth ───────────────────────────────────────────────────────────

// Route::get('/login', function () {
//     $verifier  = generateCodeVerifier();
//     $challenge = generateCodeChallenge($verifier);

//     session(['pkce_verifier' => $verifier]);

//     $query = http_build_query([
//         'client_id'             => env('ONEDRIVE_CLIENT_ID'),
//         'response_type'         => 'code',
//         'redirect_uri'          => env('ONEDRIVE_REDIRECT_URI'),
//         'response_mode'         => 'query',
//         'scope'                 => 'offline_access Files.Read Files.ReadWrite',
//         'code_challenge'        => $challenge,
//         'code_challenge_method' => 'S256',
//     ]);

//     return redirect("https://login.microsoftonline.com/" . env('ONEDRIVE_TENANT_ID') . "/oauth2/v2.0/authorize?$query");
// });

Route::get('/login', function () {
    $verifier  = generateCodeVerifier();
    $challenge = generateCodeChallenge($verifier);

    session(['pkce_verifier' => $verifier]);

    $query = http_build_query([
        'client_id'             => env('ONEDRIVE_CLIENT_ID'),
        'response_type'         => 'code',
        'redirect_uri'          => env('ONEDRIVE_REDIRECT_URI'),
        'response_mode'         => 'query',
        'scope'                 => 'offline_access Files.Read Files.ReadWrite',
        'code_challenge'        => $challenge,
        'code_challenge_method' => 'S256',
        'prompt'                => 'select_account', // ← add this
    ]);

    return redirect("https://login.microsoftonline.com/" . env('ONEDRIVE_TENANT_ID') . "/oauth2/v2.0/authorize?$query");
});

Route::get('/callback', function (Request $request) {
    $code     = $request->query('code');
    $verifier = session('pkce_verifier');

    $response = Http::asForm()
        ->withoutVerifying()
        ->post("https://login.microsoftonline.com/" . env('ONEDRIVE_TENANT_ID') . "/oauth2/v2.0/token", [
            'client_id'     => env('ONEDRIVE_CLIENT_ID'),
            'client_secret' => env('ONEDRIVE_CLIENT_SECRET'), // ← add this
            'scope'         => 'offline_access Files.Read Files.ReadWrite',
            'code'          => $code,
            'redirect_uri'  => env('ONEDRIVE_REDIRECT_URI'),
            'grant_type'    => 'authorization_code',
            'code_verifier' => $verifier,
        ]);

    $tokens = $response->json();

    if (!isset($tokens['access_token'])) {
        return response()->json(['error' => 'Token exchange failed', 'details' => $tokens], 500);
    }

    session(['access_token' => $tokens['access_token']]);

    return redirect('/files');
});

// ─── Files Pages ──────────────────────────────────────────────────────────────

Route::get('/files', function () {
    $token = session('access_token');

    if (!$token) {
        return Inertia::render('Files', ['requiresAuth' => true]);
    }

    return Inertia::render('Files', ['requiresAuth' => false]);
});

Route::get('/api/files', function () {
    $token = session('access_token');

    if (!$token) {
        return response()->json(['error' => 'Unauthenticated'], 401);
    }

    $folderId = request()->query('folder');

    $url = $folderId
        ? "https://graph.microsoft.com/v1.0/me/drive/items/{$folderId}/children"
        : "https://graph.microsoft.com/v1.0/me/drive/root/children";

    $response = Http::withToken($token)
        ->withoutVerifying()
        ->get($url);

    if ($response->failed()) {
        return response()->json(['error' => 'Failed to fetch files', 'details' => $response->json()], 500);
    }

    return response()->json($response->json()['value']);
});


// Also go to your **Azure Portal → App Registration → Authentication** and make sure the redirect URI is set to exactly:

http://localhost:8000/callback

// so the folders and files that will be displayed in the app will be from the OneDrive account of the user whose credentials I used to log in? or from OneDrive account associated with the app registration?