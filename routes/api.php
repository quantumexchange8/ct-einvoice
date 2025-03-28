<?php

use App\Http\Controllers\api\InvoiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// store invoice from crm
Route::post('/store-invoice', [InvoiceController::class, 'storeInvoice'])->name('store-invoice');
Route::post('/store-refund-invoice', [InvoiceController::class, 'storeRefundInvoice'])->name('store-refund-invoice');
Route::post('/update-status-invoice', [InvoiceController::class, 'updateStatusInvoice'])->name('update-status-invoice');

// Consolidate
Route::post('/update-consolidate-invoice', [InvoiceController::class, 'updateConsolidateInvoice'])->name('update-consolidate-invoice');

