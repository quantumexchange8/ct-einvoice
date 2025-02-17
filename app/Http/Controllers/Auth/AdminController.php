<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display a listing of invoices.
     */
    public function index()
    {
        $invoices = Invoice::all();
        return response()->json($invoices);
    }

    /**
     * Show a single invoice.
     */
    public function show($id)
    {
        $invoice = Invoice::where('invoice_no', $id)->first();
        return response()->json($invoice);
    }

    
    /**
     * Store a newly created invoice.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_no' => 'INV-001',
            'amount' => '100',
            'date' => '2025-01-27 05:38:03',
            'type' => $request->type,
            'company_url' => 'https://ct-einvoice.com',
            'business_registration' => $request->business_registration,
            'full_name' => $request->full_name,
            'tin_no' => $request->tin_no,
            'id_no' => $request->id_no,
            'sst_no' => $request->sst_no,
            'email' => $request->email,
            'contact' => $request->contact,
            'addressLine1' => $request->addressLine1,
            'addressLine2' => $request->addressLine2,
            'addressLine3' => $request->addressLine3,
            'city' => $request->city,
            'postcode' => $request->postcode,
            'state' => $request->state['state'],
            'country' => $request->country,
            'status' => 'pending',
            'id_type' => $request->id_type['name'],
            'business_registration' => $request->business_registration,
        ]);

        $invoice = Invoice::create($validated);

        return response()->json($invoice, 201);
    }

    /**
     * Update an existing invoice.
     */
    public function update(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);

        $validated = $request->validate([
            'invoice_no' => 'INV-001',
            'amount' => '100',
            'date' => '2025-01-27 05:38:03',
            'type' => $request->type,
            'company_url' => 'https://ct-einvoice.com',
            'business_registration' => $request->business_registration,
            'full_name' => $request->full_name,
            'tin_no' => $request->tin_no,
            'id_no' => $request->id_no,
            'sst_no' => $request->sst_no,
            'email' => $request->email,
            'contact' => $request->contact,
            'addressLine1' => $request->addressLine1,
            'addressLine2' => $request->addressLine2,
            'addressLine3' => $request->addressLine3,
            'city' => $request->city,
            'postcode' => $request->postcode,
            'state' => $request->state['state'],
            'country' => $request->country,
            'status' => 'pending',
            'id_type' => $request->id_type['name'],
            'business_registration' => $request->business_registration,
        ]);

        $invoice->update($validated);

        return response()->json($invoice);
    }

   
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted successfully']);
    }

    public function testing()
    {

        return Inertia::render('InvoiceListing/InvoiceListing');
    }
}
