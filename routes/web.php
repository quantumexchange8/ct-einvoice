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

Route::get('/', [InvoiceController::class, 'einvoice'])->name('einvoice');

Route::get('/invoice', [InvoiceController::class, 'invoice'])->name('invoice');
// Route::get('/invoice', [InvoiceController::class, 'invoice']);
Route::get('/getCountries', [InvoiceController::class, 'getCountries'])->name('getCountries');
Route::get('/getStates', [InvoiceController::class, 'getStates'])->name('getStates');
Route::post('/submitInvoice', [InvoiceController::class, 'submitInvoice'])->name('submitInvoice');

// get invoicing from crm
Route::post('/store-invoice', [InvoiceController::class, 'storeInvoice'])->name('store-invoice');

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
    Route::post('/logout', [ProfileController::class, 'logout'])->name('logout');

    Route::get('/configuration/{id}', [ConfigurationController::class, 'configuration']);
    Route::get('/configuration', [ConfigurationController::class, 'Configuration'])->name('configuration');
    Route::get('/getConfiguration', [ConfigurationController::class, 'getConfiguration'])->name('getConfiguration');
    Route::post('/updateConfiguration', [ConfigurationController::class, 'updateConfiguration'])->name('updateConfiguration');
    Route::get('/getCompanyData', [ConfigurationController::class, 'getCompanyData']);
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
