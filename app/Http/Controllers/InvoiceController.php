<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceRequest;
use App\Jobs\ProcessInvoiceSubmission;
use App\Models\Country;
use App\Models\Invoice;
use App\Models\Merchant;
use App\Models\MSICcode;
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
            $ExistInvoice = Invoice::where('merchant_id', $merchant_id)
                    ->where('invoice_no', $invoice_no)
                    ->first();

            // Existing invoice
            if ($ExistInvoice->status === 'pending') {
                
                return Inertia::render('Profile/Invoice', [
                    'invoice_no' => $invoice_no,
                    'merchant_id' => $merchant_id,
                    'date_issued' => $date_issued,
                    'amount' => $amount,
                    'ExistInvoice' => $ExistInvoice,
                ]);
            }
            if ($ExistInvoice->status === 'requested') {
                
                return Inertia::render('Profile/Partials/Pending', [
                    'invoice_no' => $invoice_no,
                    'merchant_id' => $merchant_id,
                    'date_issued' => $date_issued,
                    'amount' => $amount,
                    'invoice' => $ExistInvoice,
                ]);
            }

            if (!$ExistInvoice) {

                $merchant = Merchant::find($merchant_id);

                return Inertia::render('Invoice/Einvoice', [
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
        $invoice = Invoice::where('invoice_no', $request->invoice_no)
                ->where('merchant_id', $request->merchant_id)
                ->with(['invoice_lines', 'invoice_lines.classification'])
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
                'country' => $request->country,
                'status' => 'requested',
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
                'status' => 'requested',
            ]);
        }

        $merchantDetail = Merchant::find($request->merchant_id);
        $merchantId = $request->merchant_id;
        $now = Carbon::now();
        $payout = PayoutConfig::where('merchant_id', $request->merchant_id)->first();
        $checkToken = Token::where('merchant_id', $request->merchant_id)->latest()->first();
        $msic = MSICcode::find($merchantDetail->msic_id);
        $state = State::where('State', $merchantDetail->state_code)->first();

         // 1. 获取有效的 token
         $token = $this->getValidToken($merchantDetail, $checkToken);
         if (!$token) {
            return; // 或者返回错误
        }
        
        ProcessInvoiceSubmission::dispatch($invoice->id, $token, $merchantId)->onQueue('submit-invoice');

        return redirect()->back();
    }

    protected function getValidToken($merchantDetail, $checkToken)
    {
        // 如果没有 token 或者 token 已过期，获取新 token
        if (!$checkToken || Carbon::now() >= $checkToken->expired_at) {
            $accessTokenApi = $this->env === 'production'
                ? 'https://api.myinvois.hasil.gov.my/connect/token'
                : 'https://preprod-api.myinvois.hasil.gov.my/connect/token';

            $response = Http::asForm()->post($accessTokenApi, [
                'client_id' => $merchantDetail->irbm_client_id,
                'client_secret' => $merchantDetail->irbm_client_key,
                'grant_type' => 'client_credentials',
                'scope' => 'InvoicingAPI',
            ]);

            if ($response->successful()) {
                // 删除旧的 token
                Token::where('merchant_id', $merchantDetail->id)->delete();

                // 创建新的 token
                return Token::create([
                    'merchant_id' => $merchantDetail->id,
                    'token' => $response['access_token'],
                    'expired_at' => Carbon::now()->addHour(),
                ])->token;
            } else {
                Log::error('Failed to get access token', [
                    'status' => $response->status(),
                    'error' => $response->body()
                ]);
                return null;
            }
        }

       // 返回有效的现有 token
        return $checkToken->token;
    }
}
