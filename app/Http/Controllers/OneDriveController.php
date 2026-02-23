<?php

namespace App\Http\Controllers;

use App\Services\OneDriveService;
use Illuminate\Http\Request;

class OneDriveController extends Controller
{
     public function upload()
    {
        $accessToken = session('onedrive_token');

        $oneDrive = new OneDriveService($accessToken);

        $oneDrive->uploadFile('test.txt', 'Hello from Laravel');

        return 'Uploaded!';
    }
}
