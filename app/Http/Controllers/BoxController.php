<?php

namespace App\Http\Controllers;

use App\Models\BoxToken;
use App\Services\BoxService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BoxController extends Controller
{
    // **V3**
    public function __construct(protected BoxService $box) {}

    public function redirect()
    {
        return redirect($this->box->getAuthUrl());
    }

    public function callback(Request $request)
    {
        $tokens = $this->box->getAccessToken($request->get('code'));

        BoxToken::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'access_token'  => $tokens['access_token'],
                'refresh_token' => $tokens['refresh_token'],
                'expires_at'    => Carbon::now()->addSeconds($tokens['expires_in']),
            ]
        );

        return redirect()->route('box.files');
    }

    public function files(Request $request)
    {
        // Redirect to Box login if user has no token yet
        if (!BoxToken::where('user_id', Auth::id())->exists()) {
            return redirect()->route('box.connect');
        }

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
