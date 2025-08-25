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

        $query = Invoice::with(['merchant', 'merchant.msic', 'invoice_lines']);

        // Filter by status
        if ($request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('invoice_no', 'like', "%{$search}%");
            });
        }

        $invoices = $query->latest()->get();

        return response()->json($invoices);
    }
    
}