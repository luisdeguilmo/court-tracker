<?php

namespace App\Services;

use Microsoft\Graph\Graph;
use Microsoft\Graph\Model\DriveItem;
use GuzzleHttp\Exception\GuzzleException;

class OneDriveService
{
    protected Graph $graph;

    public function __construct(string $accessToken)
    {
        $this->graph = new Graph();
        $this->graph->setAccessToken($accessToken);
    }

    public function uploadFile(string $path, $content)
    {
        return $this->graph
            ->createRequest("PUT", "/me/drive/root:/{$path}:/content")
            ->attachBody($content)
            ->execute();
    }

    public function listRootItems()
    {
        return $this->graph
            ->createRequest("GET", "/me/drive/root/children")
            ->execute();
    }
}