<?php

use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\GlobalController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\InvoiceListingController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\PayoutConfigController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StoreInvoiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [InvoiceController::class, 'einvoice'])->name('einvoice');

Route::get('/invoice', [InvoiceController::class, 'invoice'])->name('invoice');
Route::post('/submitInvoice', [InvoiceController::class, 'submitInvoice'])->name('submitInvoice');
Route::post('/resubmit', [InvoiceController::class, 'resubmit'])->name('resubmit');
Route::get('/downloadInvoice/{id}/download', [InvoiceController::class, 'downloadInvoice'])->name('downloadInvoice');


    /**
     * ==============================
     *           Global use
     * ==============================
    */
    Route::get('/getClassification', [GlobalController::class, 'getClassification'])->name('getClassification');
    Route::get('/getMSICcode', [GlobalController::class, 'getMSICcode'])->name('getMSICcode');
    Route::get('/getCountries', [GlobalController::class, 'getCountries'])->name('getCountries');
    Route::get('/getStates', [GlobalController::class, 'getStates'])->name('getStates');
    Route::post('/searchTIN', [GlobalController::class, 'searchTIN'])->name('searchTIN');

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/invoice-listing', [InvoiceListingController::class, 'invoiceListing'])->name('invoice-listing');
    Route::get('/getInvoiceListing', [InvoiceListingController::class, 'getInvoiceListing'])->name('getInvoiceListing');
    Route::get('/getInvoiceStatus', [InvoiceListingController::class, 'getInvoiceStatus'])->name('getInvoiceStatus');
    Route::get('/getInvoiceChartData', [InvoiceListingController::class, 'getInvoiceChartData'])->name('getInvoiceChartData');

    
    Route::get('/getMerchants', [MerchantController::class, 'getMerchants'])->name('getMerchants');
    
    Route::post('/logout', [ProfileController::class, 'logout'])->name('logout');

    Route::get('/configuration/{id}', [ConfigurationController::class, 'configuration']);
    Route::get('/configuration', [ConfigurationController::class, 'Configuration'])->name('configuration');
    Route::get('/getConfiguration', [ConfigurationController::class, 'getConfiguration'])->name('getConfiguration');
    Route::post('/updateConfiguration', [ConfigurationController::class, 'updateConfiguration'])->name('updateConfiguration');
    Route::get('/getCompanyData', [ConfigurationController::class, 'getCompanyData']);
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    /**
     * ==============================
     *           Merchant
     * ==============================
    */
    Route::get('/merchant', [MerchantController::class, 'merchant'])->name('merchant');
    Route::get('/add-merchant', [MerchantController::class, 'addMerchant'])->name('add-merchant');
    Route::post('/submitMerchant', [MerchantController::class, 'submitMerchant'])->name('submitMerchant');
    Route::post('/updateMerchantStatus/{id}', [MerchantController::class, 'updateStatus'])->name('updateStatus');
    Route::put('/updateMerchant/{id}', [MerchantController::class, 'updateMerchant'])->name('updateMerchant');
    Route::delete('/deleteMerchant/{id}', [MerchantController::class, 'deleteMerchant'])->name('deleteMerchant');
    Route::post('/validate-step1', [MerchantController::class, 'validateStep1'])->name('validate-step1');
    Route::post('/update-validate-step1', [MerchantController::class, 'updateValidateStep1'])->name('update-validate-step1');
    Route::post('/store-merchant', [MerchantController::class, 'storeMerchant'])->name('store-merchant');
    Route::get('/countTotalMerchant', [MerchantController::class, 'countTotalMerchant'])->name('countTotalMerchant');
    Route::get('/edit-merchant/{id}', [MerchantController::class, 'editMerchant'])->name('edit-merchant');
    Route::post('/update-merchant-details', [MerchantController::class, 'updateMerchantDetails'])->name('update-merchant-details');
    Route::post('/deactivate-client/{id}', [MerchantController::class, 'deactivateClient'])->name('deactivate-client');
    
    /**
     * ==============================
     *           Payout Config
     * ==============================
    */
    Route::get('/payout-config', [PayoutConfigController::class, 'payoutConfig'])->name('payout-config');
    Route::get('/getPayout', [PayoutConfigController::class, 'getPayout'])->name('getPayout');
    Route::post('/store-payout', [PayoutConfigController::class, 'storePayout'])->name('store-payout');
    
});

require __DIR__.'/auth.php';
