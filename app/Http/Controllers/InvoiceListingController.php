<?php

namespace App\Http\Controllers;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Configuration;
class InvoiceListingController extends Controller
{
    public function invoiceListing()
    {

        return Inertia::render('InvoiceListing/InvoiceListing');
    }
    public function getInvoiceListing()
    {
        $invoices = Invoice::get();
        $configurations = Configuration::first(); 

        $configurations->logo = $configurations->getFirstMediaUrl('image');
        // $configurations = Configuration::with('media')->latest()->get();

        return response()->json([
            'configurations' => $configurations,
            'invoices' => $invoices
        ]);
    }
    
}