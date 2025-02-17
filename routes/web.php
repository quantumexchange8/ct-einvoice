<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\InvoiceListingController;
use App\Http\Controllers\ProfileController;
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

Route::get('/invoice/{id}', [InvoiceController::class, 'invoice']);
Route::get('/invoice', [InvoiceController::class, 'invoice']);
Route::get('/getCountries', [InvoiceController::class, 'getCountries'])->name('getCountries');
Route::get('/getStates', [InvoiceController::class, 'getStates'])->name('getStates');
Route::post('/submitInvoice', [InvoiceController::class, 'submitInvoice'])->name('submitInvoice');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/testing', [InvoiceListingController::class, 'testing'])->name('testing');
    Route::get('/getInvoiceListing', [InvoiceListingController::class, 'getInvoiceListing'])->name('getInvoiceListing');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
