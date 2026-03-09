<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BoxController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/files', function () {
    return Inertia::render('Files');
})->middleware(['auth', 'verified'])->name('files');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // This is now handled by BoxController
    Route::get('/box/files',                [BoxController::class, 'files'])->name('box.files');
    Route::get('/box/connect',          [BoxController::class, 'redirect'])->name('box.connect');
    Route::get('/box/callback',         [BoxController::class, 'callback'])->name('box.callback');
    Route::get('/box/download/{fileId}',[BoxController::class, 'download'])->name('box.download');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// ** V2 **
// Route::get('/box/connect',          [BoxController::class, 'redirect'])->name('box.connect');
// Route::get('/box/callback',         [BoxController::class, 'callback'])->name('box.callback');
// Route::get('/box/files',            [BoxController::class, 'files'])->name('box.files');
// Route::get('/box/download/{fileId}',[BoxController::class, 'download'])->name('box.download');

// Route::get('/', function () {
//     return "Welcome";
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// });