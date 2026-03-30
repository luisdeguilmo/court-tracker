<?php

namespace App\Http\Controllers;

use App\Services\BoxService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BoxController extends Controller
{
    public function __construct(protected BoxService $box) {}

    // No more redirect() or callback() needed — JWT handles auth automatically

    public function files(Request $request)
    {
        $folderId = $request->get('folder', '0');
        $files    = $this->box->getFiles($folderId);

        return Inertia::render('Box/Index', [
            'files'    => $files,
            'folderId' => $folderId,
        ]);
    }

    public function download(string $fileId)
    {
        $url = $this->box->getDownloadUrl($fileId);
        return redirect($url);
    }
}