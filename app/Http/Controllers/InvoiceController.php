<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceRequest;
use App\Models\Country;
use App\Models\Invoice;
use App\Models\State;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function invoice()
    {
        
        return Inertia::render('Profile/Invoice');
    }

    public function getCountries()
    {

        $country = Country::get();

        return response()->json($country);
    }

    public function getStates()
    {

        $state = State::get();

        return response()->json($state);
    }

    public function submitInvoice(InvoiceRequest $request)
    {

        // dd($request->all());

        $invoice = Invoice::create([
            'invoice_no' => 'INV-001',
            'amount' => '100',
            'date' => '2025-01-27 05:38:03',
            'type' => 'personal',
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
            
    
        ]);
        //for updated 
        // $invoice = Invoice::find($request->id);

        // $invoice->update([
        // 'full_name' => $request->full_name,
        //     'tin_no' => $request->tin_no,
        //     'id_no' => $request->id_no,
        //     'sst' => $request->sst,
        //     'full_name' => $request->full_name,
        // ]);

        return redirect()->back();
    }
}
