<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceRequest;
use App\Models\Country;
use App\Models\Invoice;
use App\Models\Merchant;
use App\Models\PayoutConfig;
use App\Models\State;
use App\Models\Token;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class InvoiceController extends Controller
{
    protected $env;

    public function __construct()
    {
        $this->env = env('APP_ENV');
    }

    public function einvoice()
    {

        return Inertia::render('Invoice/Einvoice');
    }

    public function invoice(Request $request)
    {
      
        $invoice_no = $request->query('invoice_no');
        $merchant_id = $request->query('merchant_id');
        $amount = $request->query('amount');
        $eCode = $request->query('eCode');
        $date_issued = Carbon::now()->format('Y-m-d');
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

                $merchant = Merchant::find($merchant_id);

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

        $invoice = Invoice::where('invoice_no', $request->invoice_no)
                ->where('merchant_id', $request->merchant_id)
                ->with(['invoice_lines'])
                ->first();

        if ($request->type === 'Personal') {
            $invoice->update([
                'type' => $request->type,
                'business_registration' => $request->business_registration ?? null,
                'full_name' => $request->full_name,
                'tin_no' => $request->tin_no,
                'id_type' => $request->id_type['name'],
                'id_no' => $request->id_no,
                'sst_no' => $request->sst_no,
                'email' => $request->email,
                'contact' => $request->contact,
                'addressLine1' => $request->addressLine1,
                'addressLine2' => $request->addressLine2 ?? null,
                'addressLine3' => $request->addressLine3 ?? null,
                'city' => $request->city,
                'postcode' => $request->postcode,
                'state' => $request->state['State'],
                'country' => $request->country['country'],
                'status' => 'pending',
            ]);
        } else {
            $invoice->update([
                'type' => $request->type,
                'business_registration' => $request->business_registration ?? null,
                'full_name' => $request->full_name,
                'tin_no' => $request->tin_no,
                'sst_no' => $request->sst_no,
                'email' => $request->email,
                'contact' => $request->contact,
                'addressLine1' => $request->addressLine1,
                'addressLine2' => $request->addressLine2 ?? null,
                'addressLine3' => $request->addressLine3 ?? null,
                'city' => $request->city,
                'postcode' => $request->postcode,
                'state' => $request->state['State'],
                'country' => $request->country['country'],
                'status' => 'pending',
            ]);
        }

        $merchantDetail = Merchant::find($request->merchant_id);
        $now = Carbon::now();
        $payout = PayoutConfig::where('merchant_id', $request->merchant_id)->first();
        $checkToken = Token::where('merchant_id', $request->merchant_id)->latest()->first();

        if (!$checkToken || $now >= $checkToken->expired_at) {

            if ($this->env === 'production') {
                $access_token_api = 'https://api.myinvois.hasil.gov.my/connect/token';
            } else {
                $access_token_api = 'https://preprod-api.myinvois.hasil.gov.my/connect/token';
            }

            $response = Http::asForm()->post($access_token_api, [
                'client_id' => $merchantDetail->irbm_client_id, 
                'client_secret' => $merchantDetail->irbm_client_key,
                'grant_type' => 'client_credentials',
                'scope' => 'InvoicingAPI',
            ]);

            if ($response->successful()) {
                $newToken = Token::create([
                    'merchant_id' => $request->merchant_id,
                    'token' =>  $response['access_token'],
                    'expired_at' => Carbon::now()->addHour(),
                ]);
            } else {
                $status = $response->status();
                $error = $response->body();

                Log::debug('response error', [
                    'status' => $status, 
                    'error' => $error
                ]);
            }

            // invoice line item
            // $invoiceLines = [];
            // foreach ($findTransaction->transaction_details as $index => $item) {
                
            //     $invoiceLines[] = [
            //         "ID" => [
            //             ["_" => (string)($index + 1)] // Line item ID starting from 1
            //         ],
            //         "Item" => [
            //             [
            //                 "CommodityClassification" => [
            //                     [
            //                         "ItemClassificationCode" => [
            //                             [
            //                                 "_" => $item->item->classification->code,
            //                                 "listID" => "CLASS"
            //                             ]
            //                         ]
            //                     ]
            //                 ],
            //                 "Description" => [
            //                     ["_" => $item->item->classification->description]
            //                 ]
            //             ]
            //         ],
            //         "Price" => [
            //             [
            //                 "PriceAmount" => [
            //                     [
            //                         "currencyID" => "MYR",
            //                         "_" => (float) number_format($item->price, 2, '.', ''), // Total Excluding Tax Amount
            //                     ]
            //                 ]
            //             ]
            //         ],
            //         "TaxTotal" => [
            //             [
            //                 "TaxSubtotal" => [
            //                     [
            //                         "TaxCategory" => [
            //                             [
            //                                 "ID" => [["_" => "E"]],
            //                                 "TaxScheme" => [
            //                                     [
            //                                         "ID" => [
            //                                             [
            //                                                 "_" => "OTH",
            //                                                 "schemeID" => "UN/ECE 5153",
            //                                                 "schemeAgencyID" => "6"
            //                                             ]
            //                                         ]
            //                                     ]
            //                                 ],
            //                                 "TaxExemptionReason" => [
            //                                     ["_" => "Exempt New Means of Transport"]
            //                                 ]
            //                             ]
            //                         ],
            //                         "TaxAmount" => [
            //                             [
            //                                 "_" => 0,
            //                                 "currencyID" => "MYR"
            //                             ]
            //                         ],
            //                         "TaxableAmount" => [
            //                             [
            //                                 "_" => (float) number_format($item->price, 2, '.', ''),
            //                                 "currencyID" => "MYR"
            //                             ]
            //                         ]
            //                     ]
            //                 ],
            //                 "TaxAmount" => [
            //                     [
            //                         "currencyID" => "MYR",
            //                         "_" => 0 // Total Excluding Tax Amount
            //                     ]
            //                 ]
            //             ]
            //         ],
            //         "ItemPriceExtension" => [
            //             [
            //                 "Amount" => [
            //                     [
            //                         "currencyID" => "MYR",
            //                         "_" => 100.00
            //                     ]
            //                 ]
            //             ]
            //         ],
            //         "LineExtensionAmount" => [
            //             [
            //                 "currencyID" => "MYR",
            //                 "_" => 1436.50
            //             ]
            //         ]
            //     ];
            // }
        }

        return redirect()->back();
    }
}
