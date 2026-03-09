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

// **v1**
//     public function index($folderId = '0')
// {
//     // $user = Auth::user();

//     // $accessToken = 'W4zv773sjdbusdbusbRtPBkpUEp6U';

//     $accessToken = session('box_access_token');

//     if (!$accessToken) {
//         return redirect('/box/auth');
//     }

//     $boxService = new BoxService($accessToken);

//     $data = $boxService->getFolderItems($folderId);

//     if (isset($data['error'])) {
//         return back()->with('error', $data['message']);
//     }

//     $items = collect($data['entries'])->map(function ($item) {
//         return [
//             'id'   => $item['id'],
//             'name' => $item['name'],
//             'type' => $item['type'],
//         ];
//     });

//     return Inertia::render('Box/Index', [
//         'items' => $items,
//         'currentFolder' => $folderId,
//     ]);
// }

    // **V2**
    // public function __construct(protected BoxService $box) {}

    // public function redirect()
    // {
    //     return redirect($this->box->getAuthUrl());
    // }

    // public function callback(Request $request)
    // {
    //     $token = $this->box->getAccessToken($request->get('code'));
    //     session(['box_token' => $token]);

    //     return redirect()->route('box.files');
    // }

    // public function files(Request $request)
    // {
    //     $token    = session('box_token');
    //     $folderId = $request->get('folder', '0');
    //     $files    = $this->box->getFiles($token, $folderId);

    //     return Inertia::render('Box/Index', [
    //         'files'    => $files,
    //         'folderId' => $folderId,
    //     ]);
    // }

    // public function download(Request $request, string $fileId)
    // {
    //     $token = session('box_token');
    //     $url   = $this->box->getDownloadUrl($token, $fileId);

    //     return redirect($url);
    // }

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
