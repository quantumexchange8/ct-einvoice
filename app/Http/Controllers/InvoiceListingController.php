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
    public function getInvoiceListing(Request $request)
    {

        if ($request->status === 'all') {
            $invoices = Invoice::with(['merchant', 'merchant.msic', 'invoice_lines'])->latest()->get();
        } else {
            $invoices = Invoice::where('status', $request->status)
                ->with(['merchant'])
                ->latest()
                ->get();
        }

        return response()->json($invoices);
    }
    
}