<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceRequest;
use App\Jobs\ProcessInvoiceSubmission;
use App\Models\Country;
use App\Models\Invoice;
use App\Models\InvoiceLog;
use App\Models\Merchant;
use App\Models\MSICcode;
use App\Models\PayoutConfig;
use App\Models\State;
use App\Models\Token;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use DOMDocument;
use DOMXPath;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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
                    ->with('invoice_error')
                    ->first();

            // Existing invoice
            if ($ExistInvoice) {
                if ($ExistInvoice->status === 'pending') {
                
                    return Inertia::render('Profile/Invoice', [
                        'invoice_no' => $invoice_no,
                        'merchant_id' => $merchant_id,
                        'date_issued' => $date_issued,
                        'amount' => $amount,
                        'ExistInvoice' => $ExistInvoice,
                    ]);
                } else {
                    return Inertia::render('Profile/Partials/Pending', [
                        'invoice_no' => $invoice_no,
                        'merchant_id' => $merchant_id,
                        'date_issued' => $date_issued,
                        'amount' => $amount,
                        'invoice' => $ExistInvoice,
                    ]);
                }
            } else {
                return Inertia::render('Invoice/Einvoice');
            }
            
        }
    }

    public function submitInvoice(InvoiceRequest $request)
    {
         Log::info('request->state', [
            'state' => $request->state['State'],
        ]);

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
                'issue_date' => Carbon::now()->format('Y-m-d H:i:s'),
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
                'country' => $request->country,
                'status' => 'requested',
                'issue_date' => Carbon::now()->format('Y-m-d H:i:s'),
            ]);
        }

        $merchantDetail = Merchant::find($request->merchant_id);
        $merchantId = $request->merchant_id;
        $now = Carbon::now();
        $payout = PayoutConfig::where('merchant_id', $request->merchant_id)->first();
        $checkToken = Token::where('merchant_id', $request->merchant_id)->latest()->first();
        $msic = MSICcode::find($merchantDetail->msic_id);
        $state = State::where('State', $invoice->state)->first();
        $eCode = md5($invoice->invoice_no . $merchantId . $payout->secret_key);
 
        Log::info('Details', [
            'merchantDetail' => $merchantDetail,
            'merchantId' => $merchantId,
            'checkToken' => $checkToken,
            'payout' => $payout,
            'msic' => $msic,
            'state' => $state,
        ]);

         // 1. 获取有效的 token
         $token = $this->getValidToken($merchantDetail, $checkToken);
         if (!$token) {
            return; // 或者返回错误
        }
        
        // ProcessInvoiceSubmission::dispatch($invoice->id, $token, $merchantId)->onQueue('submit-invoice');

        // 2. 调用 API 提交发票
        $invoiceLines = [];
        foreach ($invoice->invoice_lines as $index => $item) {
            $invoiceLines[] = [
                "ID" => [["_" => (string)($index + 1)]], // Line number
                "Item" => [[
                    "Description" => [["_" => $item->classification->description]],
                    "CommodityClassification" => [[
                        "ItemClassificationCode" => [[
                            "_" => $item->classification->code,
                            "listID" => "CLASS"
                        ]]
                    ]]
                ]],
                "InvoicedQuantity" => [["_" => (float) $item->quantity, "unitCode" => $item->unit ?? "EA"]],
                "LineExtensionAmount" => [["_" => round($item->item_price * $item->quantity, 2), "currencyID" => "MYR"]],
                "Price" => [[
                    "PriceAmount" => [["_" => round($item->item_price, 2), "currencyID" => "MYR"]]
                ]],
                "TaxTotal" => [[
                    "TaxSubtotal" => [[
                        "TaxCategory" => [[
                            "ID" => [["_" => "E"]],
                            "TaxScheme" => [
                                [
                                    "ID" => [[
                                        "_" => "OTH",
                                        "schemeID" => "UN/ECE 5153",
                                        "schemeAgencyID" => "6"
                                    ]]
                                ]
                            ],
                            "TaxExemptionReason" => [
                                ["_" => "Exempt New Means of Transport"]
                            ]
                        ]],
                        "TaxAmount" => [[
                            "_" => 0,
                            "currencyID" => "MYR"
                        ]],
                        "TaxableAmount" => [[
                            "_" => (float) number_format($item->item_price, 2, '.', ''),
                            "currencyID" => "MYR"
                        ]]
                    ]],
                    "TaxAmount" => [[
                            "currencyID" => "MYR",
                            "_" => 0 // Total Excluding Tax Amount
                        ]]
                    ]],
                    "ItemPriceExtension" => [[
                        "Amount" => [[
                            "currencyID" => "MYR",
                            "_" => 100.00
                    ]]
                ]]
            ];
        }

        // STEP 1&2: invoice body without signature & ubl element
        $invoiceData = [
            "_D" => "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
            "_A" => "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
            "_B" => "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
            "Invoice" => [[
                "ID" => [["_" => $invoice->invoice_no]],
                "IssueDate" => [["_" => Carbon::now('UTC')->format('Y-m-d')]],
                "IssueTime" => [["_" => Carbon::now('UTC')->format('H:i:s')."Z"]],
                "InvoiceTypeCode" => [["_" => "01", "listVersionID" => $payout->version]],
                "TaxCurrencyCode" => [["_" => "MYR"]],
                "DocumentCurrencyCode" => [["_" => "MYR"]],
                "AccountingSupplierParty" => [[
                    "Party" => [[
                        "IndustryClassificationCode" => [[
                            "_" => $msic->Code,
                            "name" => $msic->Description,
                        ]],
                        "PartyLegalEntity" => [["RegistrationName" => [["_" => $merchantDetail->name]]]],
                        "PartyIdentification" => array_filter([
                            ["ID" => [["_" => $merchantDetail->tin_no ?? "NA", "schemeID" => "TIN"]]],
                            ["ID" => [["_" => $merchantDetail->brn_no ?? "NA", "schemeID" => "BRN"]]],
                            ["ID" => [["_" => $merchantDetail->sst_no ?? "NA", "schemeID" => "SST"]]],
                            ["ID" => [["_" => "NA", "schemeID" => "TTX"]]]
                        ]),
                        "PostalAddress" => [[
                            "AddressLine" => array_filter([
                                ["Line" => [["_" => $merchantDetail->address1]]],
                                ["Line" => [["_" => $merchantDetail->address2 ?? ""]]],
                                ["Line" => [["_" => $merchantDetail->address3 ?? ""]]]
                            ]),
                            "CityName" => [["_" => $merchantDetail->city]],
                            "CountrySubentityCode" => [["_" => $state->Code]],
                            "Country" => [["IdentificationCode" => [["_" => "MYS", "listID" => "ISO3166-1", "listAgencyID" => "6"]]]]
                        ]],
                        "Contact" => [["Telephone" => [["_" => $merchantDetail->contact]], "ElectronicMail" => [["_" => $merchantDetail->email]]]]
                    ]]
                ]],
                "AccountingCustomerParty" => [[
                    "Party" => [[
                        "PartyLegalEntity" => [["RegistrationName" => [["_" => $invoice->full_name]]]],
                        "PartyIdentification" => array_filter([
                            ["ID" => [["_" => $invoice->tin_no ?? "NA", "schemeID" => "TIN"]]],
                            ["ID" => [["_" => $invoice->id_no ?? "NA", "schemeID" => "BRN"]]],
                            ["ID" => [["_" => $invoice->sst_no ?? "NA", "schemeID" => "SST"]]],
                            ["ID" => [["_" => "NA", "schemeID" => "TTX"]]]
                        ]),
                        "PostalAddress" => [[
                            "AddressLine" => array_filter([
                                ["Line" => [["_" => $invoice->addressLine1]]],
                                ["Line" => [["_" => $invoice->addressLine2 ?? ""]]],
                                ["Line" => [["_" => $invoice->addressLine3 ?? ""]]]
                            ]),
                            "CityName" => [["_" => $invoice->city]],
                            "CountrySubentityCode" => [["_" => $state->Code]],
                            "Country" => [["IdentificationCode" => [["_" => "MYS", "listID" => "ISO3166-1", "listAgencyID" => "6"]]]]
                        ]],
                        "Contact" => [["Telephone" => [["_" => $invoice->contact]], "ElectronicMail" => [["_" => $invoice->email]]]]
                    ]]
                ]],
                "TaxTotal" => [[
                    "TaxAmount" => [["_" => round($invoice->sst_amount + $invoice->service_tax, 2), "currencyID" => "MYR"]],
                    "TaxSubtotal" => [[
                        "TaxableAmount" => [["_" => round($invoice->amount, 2), "currencyID" => "MYR"]],
                        "TaxAmount" => [["_" => round($invoice->sst_amount + $invoice->service_tax, 2), "currencyID" => "MYR"]],
                        "TaxCategory" => [[
                            "ID" => [[
                                "_" => "01"]],
                            "TaxScheme" => [[
                                "ID" => [["_" => "OTH", "schemeID" => "UN/ECE 5153", "schemeAgencyID" => "6"]]
                            ]]
                        ]]
                    ]]
                ]],
                "LegalMonetaryTotal" => [[
                    "TaxExclusiveAmount" => [["_" => round($invoice->amount, 2), "currencyID" => "MYR"]],
                    "TaxInclusiveAmount" => [["_" => round($invoice->total_amount, 2), "currencyID" => "MYR"]],
                    "PayableAmount" => [["_" => round($invoice->total_amount, 2), "currencyID" => "MYR"]]
                ]],
                "InvoiceLine" => $invoiceLines
            ]]
        ];

        $document = [];

        if ($payout->version === '1.1') {
            $signed = $this->signInvoiceJson($invoiceData, $payout);
            if (!$signed) {
                Log::error('Error Signing Docs');
                return;
            }

            Log::info('completed signed xml document: ' . json_encode($signed, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

            $LatestjsonDocument = json_encode($signed);
            $latestBase64Document = base64_encode($LatestjsonDocument);

            $latestDocumentHash = hash('sha256', $LatestjsonDocument);

            $document = [
                'documents' => [
                    [
                        'format' => 'JSON',
                        'document' => $latestBase64Document,
                        'documentHash' => $latestDocumentHash,
                        'codeNumber' => $invoice->invoice_no,
                    ]
                ]
            ];
        }

        if ($payout->version === '1.0') {
            $jsonDocument = json_encode($invoiceData);
            $base64Document = base64_encode($jsonDocument);

            $documentHash = hash('sha256', $jsonDocument);

            $document = [
                'documents' => [
                    [
                        'format' => 'JSON',
                        'document' => $base64Document,
                        'documentHash' => $documentHash,
                        'codeNumber' => $invoice->invoice_no,
                    ]
                ]
            ];
        }

        Log::debug('document: ', ['document' => $document]);

        if ($this->env === 'production') {
            $docsSubmitApi = 'https://preprod-api.myinvois.hasil.gov.my/api/v1.0/documentsubmissions';
        } else {
            $docsSubmitApi = 'https://preprod-api.myinvois.hasil.gov.my/api/v1.0/documentsubmissions';
        }

        $submiturl = Http::withToken($token)->post($docsSubmitApi, $document);

        if ($submiturl->successful()) {
            Log::debug('submission ', ['submission' => $submiturl]);
            // Check if the response contains 'acceptedDocuments'
            if (!empty($submiturl['acceptedDocuments'])) {
                $submission_uuid = $submiturl['submissionUid'] ?? null;
                $uuid = $submiturl['acceptedDocuments'][0]['uuid'] ?? null;
                $status = 'Submitted';
                $remark = null;
            }

            // Check if the response contains 'rejectedDocuments'
            if (!empty($submiturl['rejectedDocuments'])) {
                $submission_uuid = $submiturl['submissionUid'] ?? null;
                $uuid = $submiturl['rejectedDocuments'][0]['uuid'] ?? null;
                $status = 'Invalid';
                $remark = $submiturl['rejectedDocuments'][0]['reason'] ?? null;
            }

            $invoice->submission_uuid = $submission_uuid;
            $invoice->invoice_uuid = $uuid;
            $invoice->status = $status;
            $invoice->invoice_status = $status;
            $invoice->remark = $remark;
            $invoice->save();

            $updateMerchantStatus = Http::post($payout->url . $payout->callBackUrl, [
                'eCode' => $eCode,
                'invoice_no' => $invoice->invoice_no,
                'submission_uuid' => $submission_uuid,
                'invoice_uuid' => $uuid,
                'status' => $invoice->invoice_status,
                'submission_date' => Carbon::now()->format('Y-m-d H:i:s'),
            ]);

            if ($updateMerchantStatus->successful()) {
                Log::debug('update callback invoice status', [
                    'status' => $updateMerchantStatus->status()
                ]);
            } else {
                Log::debug('update callback invoice status error', [
                    'status' => $updateMerchantStatus->status()
                ]);
            }
        }

        return redirect()->back();
    }

    protected function getValidToken($merchantDetail, $checkToken)
    {
        Log::info('data', [
            'merchantDetail' => $merchantDetail,
            'checkToken' => $checkToken,
        ]);

        // 如果没有 token 或者 token 已过期，获取新 token
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

    public function resubmit(Request $request)
    {

        $invoice = Invoice::find($request->id);

        $invoice->status = 'pending';
        $invoice->invoice_status = 'pending';
        $invoice->save();

        $payoutConfig = PayoutConfig::where('merchant_id', $invoice->merchant_id)->first();

        $eCode = md5($invoice->invoice_no . $invoice->merchant_id . $payoutConfig->secret_key);

        return redirect()->route('invoice', [
            'amount'      => $invoice->amount,
            'eCode'       => $eCode,
            'invoice_no'  => $invoice->invoice_no,
            'merchant_id' => $invoice->merchant_id,
        ]);
    }

    public function downloadInvoice($id)
    {
        $invoice = Invoice::with(['invoice_lines', 'invoice_lines.classification'])->find($id);
        $merchant = Merchant::with(['msic', 'classification'])->find($invoice->merchant_id);

        $prodUrl = $this->env === 'production'
            ? 'https://preprod.myinvois.hasil.gov.my/'
            : 'https://preprod.myinvois.hasil.gov.my/';

        $generateQr = $prodUrl . $invoice->invoice_uuid . '/share/' . $invoice->longId;

        return Pdf::loadView('invoices.pdf', compact('invoice', 'merchant', 'generateQr'))
            ->setPaper('a4')   // optional
            ->download("invoice-{$invoice->invoice_no}.pdf");
    }

    private function signInvoiceJson(array $invoiceData, $payout): array
    {
        $minify = fn($v) => json_encode($v, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        // 1–2. Transform
        $docForHash = $invoiceData;
        unset($docForHash['Invoice'][0]['UBLExtensions'], $docForHash['Invoice'][0]['Signature']);
        $canonicalJson = $minify($docForHash);

        // 3. DocDigest
        $DocDigest = base64_encode(hash('sha256', $canonicalJson, true));

        // 4. Load cert + sign canonical JSON (PKCS#1 v1.5 / SHA-256)
        $pfx = file_get_contents(storage_path($payout->cert_path));
        if (!openssl_pkcs12_read($pfx, $bundle, env('PRIVATE_KEY_PASS'))) {
            throw new \RuntimeException('Unable to parse PFX.');
        }
        $priv = openssl_pkey_get_private($bundle['pkey']);
        if (!$priv) throw new \RuntimeException('Private key missing.');

        if (!openssl_sign($canonicalJson, $rawSig, $priv, OPENSSL_ALGO_SHA256)) {
            throw new \RuntimeException('Signing failed.');
        }
        $Sig = base64_encode($rawSig);

        // 5. CertDigest + cert info
        $certPem        = $bundle['cert'];
        $certBase64Der  = preg_replace('/-+BEGIN CERTIFICATE-+|-+END CERTIFICATE-+|\s+/', '', $certPem);
        $certDer        = base64_decode($certBase64Der);
        $CertDigest     = base64_encode(hash('sha256', $certDer, true));
        $X509Certificate= $certBase64Der;

        $ci = openssl_x509_parse($certPem);
        // ISSUER
        $issuerPairs = [];
        foreach (array_reverse($ci['issuer']) as $k => $v) { 
            $issuerPairs[] = strtoupper($k) . '=' . $v; 
        }
        $X509IssuerName   = implode(', ', $issuerPairs);
        // SUBJECT
        $subject = $ci['subject']; // from openssl_x509_parse
        $map = [
            'emailAddress'            => 'E',
            'E'                       => 'E',
            'serialNumber'            => 'SERIALNUMBER',
            'commonName'              => 'CN',
            'CN'                      => 'CN',
            'organizationName'        => 'O',
            'O'                       => 'O',
            'countryName'             => 'C',
            'C'                       => 'C',
            'organizationIdentifier'  => 'OID.2.5.4.97',
            'OID.2.5.4.97'            => 'OID.2.5.4.97',
        ];

        $subjectPairs = [];
        foreach (array_reverse($subject) as $k => $v) {
            $key = $map[$k] ?? $k; // map if known, else keep original
            $subjectPairs[] = $key . '=' . $v;
        }

        $X509SubjectName = implode(', ', $subjectPairs);
        $X509SerialNumber = (string)($ci['serialNumber'] ?? hexdec($ci['serialNumberHex']));
        $SigningTime      = gmdate('Y-m-d\TH:i:s\Z');

        $SignedProperties = [
        "Target" => "signature",
        "SignedProperties" => [[
            "Id" => "id-xades-signed-props",
            "SignedSignatureProperties" => [[
            "SigningTime" => [[ "_" => $SigningTime ]],
            "SigningCertificate" => [[
                "Cert" => [[
                "CertDigest" => [[
                    "DigestMethod" => [[ "_" => "", "Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256" ]],
                    "DigestValue"  => [[ "_" => $CertDigest ]]
                ]],
                "IssuerSerial" => [[
                    "X509IssuerName"   => [[ "_" => $X509IssuerName ]],
                    "X509SerialNumber" => [[ "_" => $X509SerialNumber ]]
                ]]
                ]]
            ]]
            ]]
        ]]
        ];

        // 7. PropsDigest
        $PropsDigest = base64_encode(hash('sha256', $minify($SignedProperties), true));

        // 8. Build UBLExtensions + Signature
        $ublExtensions = [
        "UBLExtensions" => [[
            "UBLExtension" => [[
            "ExtensionURI" => [[ "_" => "urn:oasis:names:specification:ubl:dsig:enveloped:xades" ]],
            "ExtensionContent" => [[
                "UBLDocumentSignatures" => [[
                "SignatureInformation" => [[
                    "ID" => [[ "_" => "urn:oasis:names:specification:ubl:signature:1" ]],
                    "ReferencedSignatureID" => [[ "_" => "urn:oasis:names:specification:ubl:signature:Invoice" ]],
                    "Signature" => [[
                    "Id" => "signature",
                    "Object" => [[
                        "QualifyingProperties" => [[ "Target" => "signature" ] + $SignedProperties ]
                    ]],
                    "KeyInfo" => [[
                        "X509Data" => [[
                        "X509Certificate" => [[ "_" => $X509Certificate ]],
                        "X509SubjectName" => [[ "_" => $X509SubjectName]],
                        "X509IssuerSerial" => [[
                            "X509IssuerName"   => [[ "_" => $X509IssuerName ]],
                            "X509SerialNumber" => [[ "_" => $X509SerialNumber ]]
                        ]]
                        ]]
                    ]],
                    "SignatureValue" => [[ "_" => $Sig ]],
                    "SignedInfo" => [[
                        "SignatureMethod" => [[ "_" => "", "Algorithm" => "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" ]],
                        "Reference" => [
                        [
                            "Id" => "id-doc-signed-data",
                            "URI" => "",
                            "DigestMethod" => [[ "_" => "", "Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256" ]],
                            "DigestValue"  => [[ "_" => $DocDigest ]]
                        ],
                        [
                            "Id" => "id-xades-signed-props",
                            "Type" => "http://uri.etsi.org/01903/v1.3.2#SignedProperties",
                            "URI"  => "#id-xades-signed-props",
                            "DigestMethod" => [[ "_" => "", "Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256" ]],
                            "DigestValue"  => [[ "_" => $PropsDigest ]]
                        ],
                        ]
                    ]],
                    ]]
                ]]
                ]]
            ]]
            ]]
        ]],
        "Signature" => [[
            "ID" => [[ "_" => "urn:oasis:names:specification:ubl:signature:Invoice" ]],
            "SignatureMethod" => [[ "_" => "urn:oasis:names:specification:ubl:dsig:enveloped:xades" ]]
        ]]
        ];

        $invoiceData['Invoice'][0] = array_merge($ublExtensions, $invoiceData['Invoice'][0]);

        return $invoiceData;
    }
}
