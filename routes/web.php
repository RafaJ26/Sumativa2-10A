<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/medication-manager', function () {
    return view('medication-manager');
});

Route::get('/pwa-test', function () {
    return view('pwa-test');
});

Route::get('/sw-test', function () {
    return file_get_contents(public_path('sw-test.html'));
});

Route::get('/chrome-troubleshooting', function () {
    return file_get_contents(public_path('chrome-troubleshooting.html'));
});

Route::get('/clean-test-medications', function () {
    return file_get_contents(public_path('clean-test-medications.html'));
});

Route::get('/check-medication-data', function () {
    return file_get_contents(public_path('check-medication-data.html'));
});

Route::get('/emergency-delete-all', function () {
    return file_get_contents(public_path('emergency-delete-all.html'));
});

Route::get('/pwa-status-check', function () {
    return file_get_contents(public_path('pwa-status-check.html'));
});

Route::get('/chrome-extension-installation', function () {
    return file_get_contents(public_path('chrome-extension-installation.html'));
});

Route::get('/pwa-completed', function () {
    return file_get_contents(public_path('pwa-completed.html'));
});

Route::get('/test-extension', function () {
    return file_get_contents(public_path('test-extension.html'));
});
