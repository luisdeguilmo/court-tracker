<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class BoxService
{
    protected $client;

    public function __construct($accessToken)
    {
        $this->client = new Client([
            'base_uri' => 'https://api.box.com/2.0/',
            'headers' => [
                'Authorization' => "Bearer {$accessToken}",
                'Accept'        => 'application/json',
            ],
        ]);
    }

    public function getFolderItems($folderId = '0')
    {
        try {
            $response = $this->client->get("folders/{$folderId}/items");

            return json_decode($response->getBody(), true);
        } catch (RequestException $e) {
            return [
                'error' => true,
                'message' => $e->getMessage(),
            ];
        }
    }
}