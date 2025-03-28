<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Merchant;
use App\Models\PayoutConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{
    //

    protected function checkAPI($request) 
    {
        $apiKey = $request->header('CT-API-KEY');
        $merchant = $request->header('MERCHANT-ID');

        $merchants = Merchant::find($merchant);

        if (!$merchants) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Merchant not found',
            ], 400);
        }

        $payout = PayoutConfig::where('merchant_id', $merchants->id)->first();

        if (!$apiKey || $apiKey != $payout->secret_key) {
            return response()->json([
                'message' => 'Invalid API key',
            ], 403);
        }
    }

    public function storeInvoice(Request $request)
    {
        // CHECK HEADER API KEY
        $check = $this->checkAPI($request);
        if ($check) return $check; 

        $merchant = $request->header('MERCHANT-ID');

        $merchants = Merchant::find($merchant);
        // AFTER ALL CHECKING START VALIDATION

        $validator = Validator::make($request->all(), [
            'invoice_no' => 'required',
            'total_amount' => 'required',
            'date_time' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {

            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);

        } else {
            
            $checkInvoiceNo = Invoice::where('merchant_id', $merchants->id)->where('invoice_no', $request->invoice_no)->first();

            if ($checkInvoiceNo) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invoice already exists',
                ], 422);
            }

            $invoice = Invoice::create([
                'invoice_no' => $request->invoice_no,
                'amount' => $request->total_amount,
                'merchant_id' => $merchants->id,
                'date' => $request->date_time,
                'status' => $request->status,
                'invoice_status' => 'pending',
            ]);

            return response()->json([
                'message' => 'Invoice stored successfully'
            ], 200);
        }
    }

    public function updateStatusInvoice(Request $request)
    {

        $this->checkAPI($request);
        $merchant = $request->header('MERCHANT-ID');
        $merchants = Merchant::find($merchant);

        $checkInvoiceNo = Invoice::where('merchant_id', $merchants->id)->where('invoice_no', $request->invoice_no)->first();

        if ($checkInvoiceNo) {

            $checkInvoiceNo->status = $request->status;
            $checkInvoiceNo->save();

            return response()->json([
                'message' => 'Invoice updated successfully'
            ], 200);

        } else {
            return response()->json([
                'message' => 'Invoice not found',
            ], 400);
        }
    }

    public function updateConsolidateInvoice(Request $request)
    {

        $this->checkAPI($request);

        $merchant = $request->header('MERCHANT-ID');
        $merchants = Merchant::find($merchant);

        $validator = Validator::make($request->all(), [
            'invoices' => 'required|array|min:1',
            'invoices.*' => 'required|string|distinct'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $invoices = $request->invoices;

        foreach ($invoices as $invoice) {

            $findInvoice = Invoice::where('invoice_no', $invoice)->where('merchant_id', $merchants->id)->first();

            $findInvoice->status = 'consolidated';
            $findInvoice->save();
        }

        return response()->json([
            'message' => 'Invoice consolidated',
        ], 200);
    }
}
