<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceRequest;
use App\Models\Country;
use App\Models\Invoice;
use App\Models\PayoutConfig;
use App\Models\State;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{

    public function einvoice()
    {

        return Inertia::render('Invoice/Einvoice');
    }

    public function invoice(Request $request)
    {
      
        $invoice_no = $request->query('invoice_no');
        $merchant_id = $request->query('merchant_id');
        $amount = $request->query('amount');
        $eCode = '87bba23fb1b22b305291b47e10f8fa85';
        $date_issued = Carbon::now();
        $payoutConfig = PayoutConfig::where('merchant_id', $merchant_id)->first();

        if (empty($request->all())) {
            return Inertia::render('Invoice/Einvoice');
        } else if ($amount && $invoice_no && $merchant_id && $date_issued && $eCode) {

            $validateECode = md5($invoice_no . $merchant_id . $payoutConfig->secret_key);
            
            if ($validateECode != $eCode) {
                return Inertia::render('Invoice/Einvoice');
            }

            // find existing einvoice
            $ExistInvoice = Invoice::where('merchant_id', $merchant_id)->where('invoice_no', $invoice_no)->first();

            // Existing invoice
            if ($ExistInvoice) {
                return Inertia::render('Profile/Partials/Pending', [
                    'invoice' => $ExistInvoice
                ]);
            }

            if (!$ExistInvoice) {
                return Inertia::render('Profile/Invoice', [
                    'invoice_no' => $invoice_no,
                    'merchant_id' => $merchant_id,
                    'date_issued' => $date_issued,
                    'amount' => $amount,
                ]);
            }
        }
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

        if ($request->type === 'Personal') {
            $invoice = Invoice::create([
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
        } else {
            $invoice = Invoice::create([
                'invoice_no' => 'INV-001',
                'amount' => '100',
                'date' => '2025-01-27 05:38:03',
                'type' => $request->type,
                'company_url' => 'https://ct-einvoice.com',
                'business_registration' => $request->business_registration,
                'full_name' => $request->full_name,
                'tin_no' => $request->tin_no,
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
                'business_registration' => $request->business_registration,
        
            ]);
        }
   
        
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

    public function storeInvoice(Request $request)
    {



        return response()->json([
            'status' => '200',
            'message' => 'succesfull',
        ]);
    }
}
