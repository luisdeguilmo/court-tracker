<?php

namespace App\Http\Controllers;

use App\Services\BoxService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BoxController extends Controller
{
    public function index($folderId = '0')
{
    // $user = Auth::user();

    // $accessToken = 'W4zv773sjdbusdbusbRtPBkpUEp6U';

    $accessToken = session('box_access_token');

    if (!$accessToken) {
        return redirect('/box/auth');
    }

    $boxService = new BoxService($accessToken);

    $data = $boxService->getFolderItems($folderId);

    if (isset($data['error'])) {
        return back()->with('error', $data['message']);
    }

    $items = collect($data['entries'])->map(function ($item) {
        return [
            'id'   => $item['id'],
            'name' => $item['name'],
            'type' => $item['type'],
        ];
    });

    return Inertia::render('Box/Index', [
        'items' => $items,
        'currentFolder' => $folderId,
    ]);
}
}
