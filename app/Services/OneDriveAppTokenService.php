<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OneDriveAppTokenService
{
    // public function getToken(): ?string
    // {
    //     // Cache token until it expires (usually 1 hour)
    //     return Cache::remember('onedrive_app_token', 3500, function () {
    //         $response = Http::asForm()->post(
    //             "https://login.microsoftonline.com/" . env('ONEDRIVE_TENANT_ID') . "/oauth2/v2.0/token",
    //             [
    //                 'client_id'     => env('ONEDRIVE_CLIENT_ID'),
    //                 'client_secret' => env('ONEDRIVE_CLIENT_SECRET'),
    //                 'scope'         => 'https://graph.microsoft.com/.default',
    //                 'grant_type'    => 'client_credentials',
    //             ]
    //         );

    //         if ($response->failed()) {
    //             return null;
    //         }

    //         return $response->json()['access_token'];
    //     });
    // }

    public function getToken(): ?string
    {
        return Cache::remember('onedrive_app_token', 3500, function () {
            $response = Http::asForm()
                ->withoutVerifying() // remove in production
                ->post(
                    "https://login.microsoftonline.com/" . env('ONEDRIVE_TENANT_ID') . "/oauth2/v2.0/token",
                    [
                        'client_id'     => env('ONEDRIVE_CLIENT_ID'),
                        'client_secret' => env('ONEDRIVE_CLIENT_SECRET'),
                        'scope'         => 'https://graph.microsoft.com/.default',
                        'grant_type'    => 'client_credentials',
                    ]
                );

            Log::info('OneDrive token response', [
                'status' => $response->status(),
                'body'   => $response->json(),
            ]);

            if ($response->failed()) {
                return null;
            }

            return $response->json()['access_token'] ?? null;
        });
    }
}

