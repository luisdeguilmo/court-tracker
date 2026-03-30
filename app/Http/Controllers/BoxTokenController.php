<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Services\BoxService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BoxTokenController extends Controller
{
    public function __construct(protected BoxService $box) {}

    public function show(Request $request, string $fileId)
    {
        $user = $request->user();

        // $file = File::where('box_file_id', $fileId)
        //     ->where('user_id', $user->id)
        //     ->firstOrFail();

        $cacheKey = "box_downscoped_{$fileId}";

        $accessToken = Cache::remember($cacheKey, now()->addMinutes(50), function () use ($fileId) {
            return $this->fetchDownscopedToken($fileId);
        });

        if (!$accessToken) {
            return response()->json(['error' => 'Failed to generate preview token'], 500);
        }

        return response()->json(['accessToken' => $accessToken]);
    }

    private function fetchDownscopedToken(string $fileId): ?string
    {
        try {
            $response = Http::withoutVerifying()->asForm()->post('https://api.box.com/oauth2/token', [
                'subject_token'      => $this->box->getValidToken(), // ← use JWT token
                'subject_token_type' => 'urn:ietf:params:oauth:token-type:access_token',
                'grant_type'         => 'urn:ietf:params:oauth:grant-type:token-exchange',
                'scope'              => 'item_preview',
                'resource'           => "https://api.box.com/2.0/files/{$fileId}",
            ]);

            if (!$response->ok()) {
                Log::error('Box token exchange failed', [
                    'file_id' => $fileId,
                    'status'  => $response->status(),
                    'body'    => $response->body(),
                ]);
                return null;
            }

            return $response->json('access_token');

        } catch (\Exception $e) {
            Log::error('Box token exchange exception', [
                'file_id' => $fileId,
                'error'   => $e->getMessage(),
            ]);
            return null;
        }
    }
}