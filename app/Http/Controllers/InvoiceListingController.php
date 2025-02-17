<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceListingController extends Controller
{
    public function testing()
    {

        return Inertia::render('InvoiceListing/InvoiceListing');
    }
    public function getInvoiceListing()
    {

        $invoices = Invoice::get();

        return response()->json($invoices);
    }
}
