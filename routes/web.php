<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\InvoiceListingController;
use App\Http\Controllers\MerchantController;
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

    Route::get('/invoice-listing', [InvoiceListingController::class, 'invoiceListing'])->name('invoice-listing');
    Route::get('/getInvoiceListing', [InvoiceListingController::class, 'getInvoiceListing'])->name('getInvoiceListing');

    Route::get('/merchant', [MerchantController::class, 'merchant']);
    Route::get('/getMerchants', [MerchantController::class, 'getMerchants']);
    Route::post('/submitMerchant', [MerchantController::class, 'submitMerchant'])->name('submitMerchant');
    Route::post('/updateMerchantStatus/{id}', [MerchantController::class, 'updateStatus']);
    Route::put('/updateMerchant/{id}', [MerchantController::class, 'updateMerchant']);
    Route::delete('/deleteMerchant/{id}', [MerchantController::class, 'deleteMerchant']);
    
    Route::get('/configuration/{id}', [ConfigurationController::class, 'configuration']);
    Route::get('/configuration', [ConfigurationController::class, 'Configuration'])->name('configuration');
    Route::get('/getConfiguration', [ConfigurationController::class, 'getConfiguration'])->name('getConfiguration');
    Route::post('/updateConfiguration', [ConfigurationController::class, 'updateConfiguration'])->name('updateConfiguration');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
