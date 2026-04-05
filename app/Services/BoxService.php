<?php

namespace App\Services;

use Box\SDK\Box;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\UploadedFile;

class BoxService
{
    protected function getClient(): \GuzzleHttp\Client
    {
        $token = $this->getValidToken();

        return new \GuzzleHttp\Client([
            'base_uri' => 'https://api.box.com/2.0/',
            'verify'   => false,
            'headers'  => [
                'Authorization' => "Bearer {$token}",
                'Content-Type'  => 'application/json',
            ],
        ]);
    }

    public function getValidToken(): string
    {
        return Cache::remember('box_jwt_token', 3000, function () {
            $now = time() - 10; // ← fix clock skew
            $keyId = env('BOX_JWT_PUBLIC_KEY_ID');
            $enterpriseId = env('BOX_ENTERPRISE_ID');
            $clientId = env('BOX_CLIENT_ID');
            $clientSecret = env('BOX_CLIENT_SECRET');
            // $privateKeyPath = env('BOX_JWT_PRIVATE_KEY_PATH');
            $passphrase = env('BOX_JWT_PRIVATE_KEY_PASSPHRASE');
            // $privateKeyPath = storage_path('app/box/private_key.pem');

            $privateKeyContent = file_get_contents(storage_path('app/box/private_key.pem'));

            // Fix escaped newlines if key was copied from .env or JSON
            $privateKeyContent = str_replace(['\r\n', '\n', '\r'], "\n", $privateKeyContent);

            $privateKey = openssl_pkey_get_private($privateKeyContent, $passphrase);

            if (!$privateKey) {
                throw new \Exception('Failed to load Box private key: ' . openssl_error_string());
            }

            // // Load private key
            // $privateKey = openssl_pkey_get_private(
            //     // file_get_contents($privateKeyPath),
            //     $passphrase
            // );

            // Build JWT claims
            $claims = [
                'iss' => $clientId,
                'sub' => $enterpriseId,
                'box_sub_type' => 'enterprise',
                'aud' => 'https://api.box.com/oauth2/token',
                'jti' => bin2hex(random_bytes(16)),
                'exp' => $now + 60,
                'iat' => $now,
            ];

            // Encode JWT manually (or use lcobucci/jwt)
            $header = base64url_encode(json_encode([
                'alg' => 'RS256',
                'typ' => 'JWT',
                'kid' => $keyId,
            ]));
            $payload = base64url_encode(json_encode($claims));
            $data = "$header.$payload";

            openssl_sign($data, $signature, $privateKey, OPENSSL_ALGO_SHA256);
            $jwt = $data . '.' . base64url_encode($signature);

            // Exchange JWT for access token
            $response = \Illuminate\Support\Facades\Http::withoutVerifying()
                ->asForm()
                ->post('https://api.box.com/oauth2/token', [
                    'grant_type'         => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    'client_id'          => $clientId,
                    'client_secret'      => $clientSecret,
                    'assertion'          => $jwt,
                ]);

            if ($response->failed()) {
                throw new \Exception('Box JWT auth failed: ' . $response->body());
            }

            return $response->json('access_token');
        });
    }

    public function getFiles(string $folderId = '0'): array
    {
        $client = $this->getClient();

        $response = $client->get("folders/{$folderId}/items", [
            'query' => [
                'fields' => 'id,name,type,size,modified_at',
                'limit'  => 100,
            ],
        ]);

        $entries = json_decode($response->getBody(), true)['entries'] ?? [];

        return collect($entries)->map(fn($item) => [
            'id'          => $item['id'],
            'name'        => $item['name'],
            'type'        => $item['type'],
            'size'        => $item['size'] ?? null,
            'modified_at' => $item['modified_at'] ?? null,
        ])->toArray();
    }

    public function getDownloadUrl(string $fileId): string
    {
        $token = $this->getValidToken();

        $response = \Illuminate\Support\Facades\Http::withoutVerifying()
            ->withToken($token)
            ->withoutRedirecting()
            ->get("https://api.box.com/2.0/files/{$fileId}/content");

        return $response->header('Location');
    }

    public function createFolder(string $name, string $parentId = '0'): string
    {
         $parentId = ($parentId !== '' && $parentId !== '0')
        ? $parentId
        : env('BOX_ROOT_FOLDER_ID', '0');

        $client = $this->getClient();

        $response = $client->post('folders', [
            'json' => [
                'name'   => $name,
                'parent' => ['id' => $parentId],
            ],
        ]);

        $data = json_decode($response->getBody(), true);
        return $data['id'];
    }

    public function fileExistsInBox(string $folderId, string $fileName): bool
    {
        $token = $this->getValidToken();

        $response = \Illuminate\Support\Facades\Http::withoutVerifying()
            ->withToken($token)
            ->get("https://api.box.com/2.0/folders/{$folderId}/items", [
                'fields' => 'name',
                'limit'  => 1000,
            ]);

        if ($response->failed()) {
            throw new \Exception('Box API error: ' . $response->body());
        }

        $items = $response->json('entries') ?? [];

        foreach ($items as $item) {
            if ($item['name'] === $fileName) {
                return true;
            }
        }

        return false;
    }

    public function generateUniqueFileName(string $folderId, string $fileName): string
    {
        $nameWithoutExt = pathinfo($fileName, PATHINFO_FILENAME);
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);

        $newName = $fileName;
        $counter = 1;

        while ($this->fileExistsInBox($folderId, $newName)) {
            $newName = $nameWithoutExt . " ($counter)." . $extension;
            $counter++;
        }

        return $newName;
    }

    // public function uploadFile(UploadedFile $file, string $folderId = '0'): string
    // {
    //     $folderId = ($folderId !== '' && $folderId !== '0')
    //     ? $folderId
    //     : env('BOX_ROOT_FOLDER_ID', '0');

    //     $token = $this->getValidToken();

    //     $response = \Illuminate\Support\Facades\Http::withoutVerifying()
    //         ->withToken($token)
    //         ->attach('file', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
    //         ->post('https://upload.box.com/api/2.0/files/content', [
    //             'attributes' => json_encode([
    //                 'name'   => $file->getClientOriginalName(),
    //                 'parent' => ['id' => $folderId],
    //             ]),
    //         ]);

    //     if ($response->failed()) {
    //         throw new \Exception('Box file upload failed: ' . $response->body());
    //     }

    //     return $response->json('entries.0.id');
    // }

    public function uploadFile(UploadedFile $file, string $folderId = '0', ?string $fileName = null): string
    {
        $folderId = ($folderId !== '' && $folderId !== '0')
            ? $folderId
            : env('BOX_ROOT_FOLDER_ID', '0');

        $token = $this->getValidToken();

        // ✅ Use provided filename OR fallback to original
        $finalName = $fileName ?? $file->getClientOriginalName();

        $response = \Illuminate\Support\Facades\Http::withoutVerifying()
            ->withToken($token)
            ->attach('file', file_get_contents($file->getRealPath()), $finalName)
            ->post('https://upload.box.com/api/2.0/files/content', [
                'attributes' => json_encode([
                    'name'   => $finalName,
                    'parent' => ['id' => $folderId],
                ]),
            ]);

        if ($response->failed()) {
            throw new \Exception('Box file upload failed: ' . $response->body());
        }

        return $response->json('entries.0.id');
    }

    public function deleteFile(string $fileId): void
    {
        $client = $this->getClient();
        $client->delete("files/{$fileId}");
    }
}

if (!function_exists('base64url_encode')) {
    function base64url_encode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}