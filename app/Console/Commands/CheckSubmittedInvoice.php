<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\InvoiceError;
use App\Models\Merchant;
use App\Models\PayoutConfig;
use App\Models\Token;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckSubmittedInvoice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:submitted-invoice';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check submited invoice status in every minuites.';

    /**
     * Execute the console command.
     */

    protected $env;

    public function __construct()
    {
        parent::__construct();
        $this->env = env('APP_ENV');
    }

    public function handle()
    {
        $submiitedInvoices = Invoice::where('status', 'Submitted')
                        ->where('invoice_status', 'Submitted')
                        ->get();

        if ($submiitedInvoices->isEmpty()) {
            Log::info('No pending submission');
            return;
        }
        
        foreach ($submiitedInvoices as $invoice) {
            $this->checkSubmittedInvoice($invoice);
        }
    }

    protected function checkSubmittedInvoice(Invoice $invoice)
    {
        $checkToken = Token::where('merchant_id', $invoice->merchant_id)->latest()->first();
        $merchantDetail = Merchant::find($invoice->merchant_id);
        $payoutConfig = PayoutConfig::where('merchant_id', $invoice->merchant_id)->first();

        $token = $this->getValidToken($merchantDetail, $checkToken);

         if (!$token) {
            return; // 或者返回错误
        }

        $docsStatusApi = $this->env === 'production'
            ? "https://preprod-api.myinvois.hasil.gov.my/api/v1.0/documents/{$invoice->invoice_uuid}/details"
            : "https://preprod-api.myinvois.hasil.gov.my/api/v1.0/documents/{$invoice->invoice_uuid}/details";
        
        $submiturl = Http::withToken($token)->get($docsStatusApi);

        if ($submiturl->successful()) {
            Log::debug('submission ', [
                'invoice No.: ' => $invoice->invoice_no,
                'submission' => $submiturl,
            ]);

            $invoice->status = $submiturl['status'];
            $invoice->invoice_status = $submiturl['status'];
            $invoice->longId = $submiturl['longId'];
            $invoice->internal_id = $submiturl['internalId'];
            $invoice->rejected_at = $submiturl['rejectRequestDateTime'] ?? null;
            $invoice->remark = $submiturl['documentStatusReason'] ?? null;
            $invoice->invoice_datetime = isset($submiturl['dateTimeValidated'])? Carbon::parse($submiturl['dateTimeValidated'])->format('Y-m-d H:i:s'): null;
            $invoice->save();

            $eCode = md5($invoice->invoice_no . $payoutConfig->merchant_id . $payoutConfig->secret_key);
            $params = [
                'eCode' => $eCode,
                'invoice_no' => $invoice->invoice_no,
                'submission_uuid' => $invoice->submission_uuid,
                'invoice_uuid' => $invoice->invoice_uuid,
                'longId' => $invoice->longId,
                'status' => $invoice->invoice_status,
                'invoice_datetime' => $invoice->invoice_datetime,
                'submission_date' => $invoice->issue_date,
                'callback_type' => 'update-status'
            ];

            $updateCallback = Http::post($payoutConfig->url . '/api/client-submitted-einvoice', $params);
            Log::info('update callback to merchant', [
                'status' => $updateCallback->status()
            ]);

            if ($submiturl['status'] === 'Invalid') {
                $invoiceId = $invoice->id; // FK reference to your invoices table

                foreach ($submiturl['validationResults']['validationSteps'] as $step) {
                    if ($step['status'] === 'Invalid' && isset($step['error'])) {
                        $errorStep = $step['error']['error'] ?? $step['name'];

                        // If there are multiple innerErrors
                        if (!empty($step['error']['innerError'])) {
                            foreach ($step['error']['innerError'] as $innerError) {
                                InvoiceError::create([
                                    'invoice_id'   => $invoiceId,
                                    'error_step'   => $errorStep,
                                    'error_code'   => $innerError['errorCode'] ?? null,
                                    'error_message'=> $innerError['error'] ?? null,
                                ]);
                            }
                        } else {
                            // If only single error without innerError
                            InvoiceError::create([
                                'invoice_id'   => $invoiceId,
                                'error_step'   => $errorStep,
                                'error_code'   => $step['error']['errorCode'] ?? null,
                                'error_message'=> $step['error']['error'] ?? null,
                            ]);
                        }
                    }
                }
            }
            
        } else {
            Log::debug('Error submission ', [
                'invoice No.: ' => $invoice->invoice_no,
                'error' => $submiturl,
            ]);
        }
    }

    protected function getValidToken($merchantDetail, $checkToken)
    {
        if (!$checkToken || Carbon::now() >= $checkToken->expired_at) {
            $accessTokenApi = $this->env === 'production'
                ? 'https://preprod-api.myinvois.hasil.gov.my/connect/token'
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
