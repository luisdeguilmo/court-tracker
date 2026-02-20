<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return "Hello";
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
});

Route::get('/files', function () {
    return Inertia::render('Files');
});

Route::get('/settings', function () {
    return Inertia::render('Settings');
});



use Laravel\Socialite\Facades\Socialite;

Route::get('/auth/redirect', function () {
    return Socialite::driver('azure')->redirect();
});

Route::get('/auth/callback', function () {
    $user = Socialite::driver('azure')->user();

    $token = $user->token;

    return $token; // Save this in DB
});
