<?php

namespace App\Services;

use App\Models\BoxToken;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class BoxService
{
    // ** V3 **
     public function getAuthUrl(): string
    {
        $params = http_build_query([
            'response_type' => 'code',
            'client_id'     => env('BOX_CLIENT_ID'),
            'redirect_uri'  => env('BOX_REDIRECT_URI'),
        ]);

        return "https://account.box.com/api/oauth2/authorize?{$params}";
    }

    public function getAccessToken(string $code): array
    {
        $response = Http::withoutVerifying()
            ->asForm()
            ->post('https://api.box.com/oauth2/token', [
                'grant_type'    => 'authorization_code',
                'code'          => $code,
                'client_id'     => env('BOX_CLIENT_ID'),
                'client_secret' => env('BOX_CLIENT_SECRET'),
                'redirect_uri'  => env('BOX_REDIRECT_URI'),
            ]);

        return $response->json();
    }

    public function refreshToken(string $refreshToken): array
    {
        $response = Http::withoutVerifying()
            ->asForm()
            ->post('https://api.box.com/oauth2/token', [
                'grant_type'    => 'refresh_token',
                'refresh_token' => $refreshToken,
                'client_id'     => env('BOX_CLIENT_ID'),
                'client_secret' => env('BOX_CLIENT_SECRET'),
            ]);

        return $response->json();
    }

    // Gets a valid token for the current user — auto-refreshes if expired
    public function getValidToken(): ?string
    {
        $boxToken = BoxToken::where('user_id', Auth::id())->first();

        if (!$boxToken) {
            return null;
        }

        if ($boxToken->isExpired()) {
            $tokens = $this->refreshToken($boxToken->refresh_token);

            $boxToken->update([
                'access_token'  => $tokens['access_token'],
                'refresh_token' => $tokens['refresh_token'],
                'expires_at'    => Carbon::now()->addSeconds($tokens['expires_in']),
            ]);
        }

        return $boxToken->access_token;
    }

    public function getFiles(string $folderId = '0'): array
    {
        $token    = $this->getValidToken();
        $response = Http::withoutVerifying()
            ->withToken($token)
            ->get("https://api.box.com/2.0/folders/{$folderId}/items", [
                'fields' => 'id,name,type,size,modified_at',
                'limit'  => 100,
            ]);

        return collect($response->json('entries'))->map(fn($item) => [
            'id'          => $item['id'],
            'name'        => $item['name'],
            'type'        => $item['type'],
            'size'        => $item['size'] ?? null,
            'modified_at' => $item['modified_at'] ?? null,
        ])->toArray();
    }

    public function getDownloadUrl(string $fileId): string
    {
        $token    = $this->getValidToken();
        $response = Http::withoutVerifying()
            ->withToken($token)
            ->withoutRedirecting()
            ->get("https://api.box.com/2.0/files/{$fileId}/content");

        return $response->header('Location');
    }
}