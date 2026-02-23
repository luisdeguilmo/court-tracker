<?php

use App\Services\OneDriveAppTokenService;
use App\Services\OneDriveService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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

// ─── OneDrive OAuth (User Login) ──────────────────────────────────────────────

Route::get('/login', function () {
    $verifier = generateCodeVerifier();
    session(['pkce_verifier' => $verifier]);
    $challenge = generateCodeChallenge($verifier);

    $query = http_build_query([
        'client_id'             => env('ONEDRIVE_CLIENT_ID'),
        'response_type'         => 'code',
        'redirect_uri'          => env('ONEDRIVE_REDIRECT_URI'),
        'response_mode'         => 'query',
        'scope'                 => 'offline_access Files.ReadWrite',
        'code_challenge'        => $challenge,
        'code_challenge_method' => 'S256',
    ]);

    return redirect("https://login.microsoftonline.com/" . env('ONEDRIVE_TENANT_ID') . "/oauth2/v2.0/authorize?$query");
});

Route::get('/callback', function (Request $request) {
    $code     = $request->query('code');
    $verifier = session('pkce_verifier');

    $response = Http::asForm()
        ->withoutVerifying() // remove in production
        ->post("https://login.microsoftonline.com/" . env('ONEDRIVE_TENANT_ID') . "/oauth2/v2.0/token", [
            'client_id'     => env('ONEDRIVE_CLIENT_ID'),
            'scope'         => 'offline_access Files.ReadWrite',
            'code'          => $code,
            'redirect_uri'  => env('ONEDRIVE_REDIRECT_URI'),
            'grant_type'    => 'authorization_code',
            'code_verifier' => $verifier,
        ]);

    $tokens = $response->json();
    session(['access_token' => $tokens['access_token']]);

    return 'Logged in successfully!';
});

Route::get('/data', function () {
    $accessToken = session('access_token');

    if (!$accessToken) {
        return redirect('/login');
    }

    $service = new OneDriveService($accessToken);
    $items   = $service->listRootItems();

    $result = [];
    foreach ($items as $item) {
        $result[] = [
            'name' => $item->getName(),
            'type' => $item->getFolder() ? 'folder' : 'file',
            'id'   => $item->getId(),
        ];
    }

    return response()->json($result);
});

// ─── OneDrive Files (No Auth Required) ───────────────────────────────────────

Route::get('/files', function (OneDriveAppTokenService $tokenService) {
    // $token = $tokenService->getToken();

    // if (!$token) {
    //     return response()->json(['error' => 'Could not retrieve app token'], 500);
    // }

    // Bypass cache temporarily to see real error
    Cache::forget('onedrive_app_token');
    
    $token = $tokenService->getToken();

    if (!$token) {
        // Check logs for details
        return response()->json([
            'error'   => 'Could not retrieve app token',
            'check'   => 'See storage/logs/laravel.log for details',
            'env_check' => [
                'tenant_id'    => env('ONEDRIVE_TENANT_ID') ? 'SET' : 'MISSING',
                'client_id'    => env('ONEDRIVE_CLIENT_ID') ? 'SET' : 'MISSING',
                'client_secret'=> env('ONEDRIVE_CLIENT_SECRET') ? 'SET' : 'MISSING',
                'user_id'      => env('ONEDRIVE_USER_ID') ? 'SET' : 'MISSING',
            ]
        ], 500);
    }

    $userId = env('ONEDRIVE_USER_ID');

    $response = Http::withToken($token)
        ->withoutVerifying() // remove in production
        ->get("https://graph.microsoft.com/v1.0/users/{$userId}/drive/root/children");

    if ($response->failed()) {
        return response()->json(['error' => 'Failed to fetch files', 'details' => $response->json()], 500);
    }

    $items = $response->json()['value'];

    $result = collect($items)->map(fn($item) => [
        'id'   => $item['id'],
        'name' => $item['name'],
        'type' => isset($item['folder']) ? 'folder' : 'file',
        'size' => $item['size'] ?? 0,
        'url'  => $item['webUrl'] ?? null,
    ]);

    return response()->json($result);
});

Route::get('/files/{folderId}', function (string $folderId, OneDriveAppTokenService $tokenService) {
    $token  = $tokenService->getToken();
    $userId = env('ONEDRIVE_USER_ID');

    $response = Http::withToken($token)
        ->withoutVerifying() // remove in production
        ->get("https://graph.microsoft.com/v1.0/users/{$userId}/drive/items/{$folderId}/children");

    if ($response->failed()) {
        return response()->json(['error' => 'Failed to fetch folder contents', 'details' => $response->json()], 500);
    }

    $items = $response->json()['value'];

    $result = collect($items)->map(fn($item) => [
        'id'   => $item['id'],
        'name' => $item['name'],
        'type' => isset($item['folder']) ? 'folder' : 'file',
        'size' => $item['size'] ?? 0,
        'url'  => $item['webUrl'] ?? null,
    ]);

    return response()->json($result);
});

Route::get('/debug-users', function (OneDriveAppTokenService $tokenService) {
    $token = $tokenService->getToken();

    $response = Http::withToken($token)
        ->withoutVerifying()
        ->get("https://graph.microsoft.com/v1.0/users?\$select=id,displayName,mail,assignedLicenses");

    return response()->json($response->json());
});