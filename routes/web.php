<?php

// use App\Http\Controllers\ProfileController;
// use App\Http\Controllers\BoxController;
// use Illuminate\Foundation\Application;
// use Illuminate\Support\Facades\Route;
// use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('/files', function () {
//     return Inertia::render('Files');
// })->middleware(['auth', 'verified'])->name('files');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/dashboard', function () {
//         return Inertia::render('Dashboard');
//     })->name('dashboard');

//     // This is now handled by BoxController
//     Route::get('/box/files',                [BoxController::class, 'files'])->name('box.files');
//     Route::get('/box/connect',          [BoxController::class, 'redirect'])->name('box.connect');
//     Route::get('/box/callback',         [BoxController::class, 'callback'])->name('box.callback');
//     Route::get('/box/download/{fileId}',[BoxController::class, 'download'])->name('box.download');
// });

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// require __DIR__.'/auth.php';




use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BoxController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\RecordsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // ── Box OAuth + raw Box file browser ──────────────────────────────────
    Route::get('/box/connect',           [BoxController::class, 'redirect'])->name('box.connect');
    Route::get('/box/callback',          [BoxController::class, 'callback'])->name('box.callback');
    Route::get('/box/files',             [BoxController::class, 'files'])->name('box.files');
    Route::get('/box/download/{fileId}', [BoxController::class, 'download'])->name('box.download');

    // ── DB Folders + their Box-backed files ───────────────────────────────
    Route::get('/folders',         [FolderController::class, 'index'])->name('folders.index');
    Route::get('/folders/{folder}',[FolderController::class, 'show'])->name('folders.show');
    Route::post('/folders', [FolderController::class, 'store'])->name('folders.store');

    // Route::get('/files', [FileController::class, 'index'])
    //     ->name('files.index');
 
    Route::post('/files', [FileController::class, 'store'])
        ->name('files.store');
    Route::get('/files/{file}', [FileController::class, 'show'])
        ->name('files.show');
    Route::delete('/files/{file}', [FileController::class, 'destroy'])
        ->name('files.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/records', [RecordsController::class, 'index'])->name('records.index');
    Route::post('/records', [RecordsController::class, 'store'])->name('records.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';