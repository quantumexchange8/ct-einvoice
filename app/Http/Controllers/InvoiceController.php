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
use DOMDocument;
use DOMXPath;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Spatie\LaravelPdf\Facades\Pdf;

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
            } else {
                return Inertia::render('Profile/Partials/Pending', [
                    'invoice_no' => $invoice_no,
                    'merchant_id' => $merchant_id,
                    'date_issued' => $date_issued,
                    'amount' => $amount,
                    'invoice' => $ExistInvoice,
                ]);
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
                "InvoiceTypeCode" => [["_" => "01", "listVersionID" => "1.0"]],
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

        // STEP 3: Canonicalize the document and generate the document hash (digest)
        function canonicalizeJson($data) {
            if (is_array($data)) {
                // Object: sort keys lexicographically
                if (array_keys($data) !== range(0, count($data) - 1)) {
                    ksort($data);
                }
                foreach ($data as $k => $v) {
                    $data[$k] = canonicalizeJson($v);
                }
                return $data;
            }
            return $data;
        }
        function toCanonicalJson($data)
        {
            return json_encode(
                canonicalizeJson($data),
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
            );
        }


        // 1. Canonicalize
        $canonicalData = canonicalizeJson($invoiceData); // canonical version, to be used for signing
        // 2. Minify JSON (no spaces, no line breaks, no slash escaping)
        $canonicalJson = json_encode($canonicalData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); // Hash the canonicalized document invoice body using SHA-256
        Log::info('canonicalJson ', ['canonicalJson' => $canonicalJson]);

        // 3. SHA-256 binary hash
        $binaryHash = hash('sha256', $canonicalJson, true);
        // 4. Convert HEX → Base64
        // $docDigest = base64_encode($binaryHash);
        // Log::info('DocDigest ' . $docDigest);
        
        // ----- Step 4: Sign the document digest -----
        $pfxFile = storage_path('certs/signing.pfx'); // your soft cert path
        $pfxPassword = env('PRIVATE_KEY_PASS');       // PIN/password from env
        
        // Load the .p12/.pfx file
        $pfxContent = file_get_contents($pfxFile);
        if ($pfxContent === false) {
            Log::error('Unable to read PFX file');
        }

        // Extract cert + private key
        $certs = [];
        if (!openssl_pkcs12_read($pfxContent, $certs, $pfxPassword)) {
            while ($error = openssl_error_string()) {
                \Log::error("OpenSSL Error: $error");
            }
            throw new \Exception("Unable to parse PFX file. Check password and file.");
        }
        // Get private key
        $privateKey = openssl_pkey_get_private($certs['pkey']);
        if (!$privateKey) {
            Log::error('Unable to get the private key');
        }

        // Sign the binary hash (RSA-SHA256)
        $signature = '';
        if (!openssl_sign($binaryHash, $signature, $privateKey, OPENSSL_ALGO_SHA256)) {
            Log::error('Unable to sign document digest');
        }

        // Convert signature → Base64 for Sig field
        $sig = base64_encode($signature);
        Log::info('sig ' . $sig);

        // --- STEP 5: Prepare certificate info ---
        $X509Certificate = preg_replace('/\-+BEGIN CERTIFICATE\-+|\-+END CERTIFICATE\-+|\s+/', '', $certs['cert']);
        $CertDigest = base64_encode(hash('sha256', base64_decode($X509Certificate), true));
        $certInfo = openssl_x509_parse($certs['cert']);
        $issuerParts = [];
        foreach (array_reverse($certInfo['issuer']) as $key => $value) {
            $issuerParts[] = strtoupper($key) . '=' . $value;
        }
        $issuerName = implode(', ', $issuerParts);
        $serialNumber = $certInfo['serialNumber'];
        $signingTime = gmdate('Y-m-d\TH:i:s\Z');

        $SignedProperties = [
            "SignedProperties" => [[
                "Id" => "id-xades-signed-props",
                "SignedSignatureProperties" => [[
                    "SigningTime" => [["_" => $signingTime]],
                    "SigningCertificate" => [[
                        "Cert" => [[
                            "CertDigest" => [[
                                "DigestMethod" => [[
                                    "_" => "",
                                    "Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256"
                                ]],
                                "DigestValue" => [["_" => $CertDigest]]
                            ]],
                            "IssuerSerial" => [[
                                "X509IssuerName" => [["_" => $issuerName]],
                                "X509SerialNumber" => [["_" => $serialNumber]]
                            ]]
                        ]]
                    ]]
                ]]
            ]]
        ];

        $canonicalSP  = canonicalizeJson($SignedProperties);
        Log::info('canonicalSP: ', ['canonicalSP' => $canonicalSP]);
        $signedPropsDigest = base64_encode(hash('sha256', json_encode($canonicalSP, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), true));
        Log::info('SignedProperties Digest: ' . $signedPropsDigest);

        $ublExtensions = [
           "UBLExtensions" => [[
                "UBLExtension" => [[
                    "ExtensionURI" => [[
                        "_" => "urn:oasis:names:specification:ubl:dsig:enveloped:xades"
                    ]],
                    "ExtensionContent" => [[
                        "UBLDocumentSignatures" => [[
                            "SignatureInformation" => [[
                                "ID" => [[
                                    "_" => "urn:oasis:names:specification:ubl:signature:1"
                                ]],
                                "ReferencedSignatureID" => [[
                                    "_" => "urn:oasis:names:specification:ubl:signature:Invoice"
                                ]],
                                "Signature" => [[
                                    "Id" => "signature",
                                    "Object" => [[
                                        "QualifyingProperties" => [[
                                            "Target" => "signature",
                                        ] + $SignedProperties]
                                    ]],
                                    "KeyInfo" => [[
                                        "X509Data" => [[
                                            "X509Certificate" => [["_"=> $X509Certificate]],
                                            "X509SubjectName" => [["_"=> $issuerName]],
                                            "X509IssuerSerial" => [[
                                                "X509IssuerName" => [["_" => $issuerName,]],
                                                "X509SerialNumber" => [["_" => $serialNumber,]]
                                            ]]
                                        ]]
                                    ]],
                                    "SignatureValue" => [["_"=> ""]], // Sig
                                    "SignedInfo" => [[
                                        "SignatureMethod" => [[
                                            "_" => "",
                                            "Algorithm" => "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"
                                        ]],
                                        "Reference" => [
                                            [
                                                "Type" => "http://uri.etsi.org/01903/v1.3.2#SignedProperties",
                                                "URI" => "#id-xades-signed-props",
                                                "DigestMethod" => [[
                                                    "_" => "",
                                                    "Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256"
                                                ]],
                                                "DigestValue" => [["_"=> $signedPropsDigest]] // SignedProperties
                                            ],
                                            [
                                                "Type" => "",
                                                "URI" => "",
                                                "DigestMethod" => [[
                                                    "_" => "",
                                                    "Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256"
                                                ]],
                                                "DigestValue" => [["_"=> ""]] // DocDigest
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
                "ID" => [[
                    "_" => "urn:oasis:names:specification:ubl:signature:Invoice"
                ]],
                "SignatureMethod" => [[
                    "_" => "urn:oasis:names:specification:ubl:dsig:enveloped:xades",
                ]]
            ]]
        ];

        // Merge into invoice
        $invoiceData['Invoice'][0] = array_merge($ublExtensions, $invoiceData['Invoice'][0]);

        // -------------------
        // STEP 3: Digest SignedProperties
        // -------------------
        $spPath = &$invoiceData['Invoice'][0]['UBLExtensions'][0]['UBLExtension'][0]['ExtensionContent'][0]
            ['UBLDocumentSignatures'][0]['SignatureInformation'][0]['Signature'][0]['Object'][0]
            ['QualifyingProperties'][0]['SignedProperties'][0];

        $spCanonicalJson = toCanonicalJson($spPath);
        $signedPropsDigest = base64_encode(hash('sha256', $spCanonicalJson, true));

        $invoiceData['Invoice'][0]['UBLExtensions'][0]['UBLExtension'][0]['ExtensionContent'][0]
            ['UBLDocumentSignatures'][0]['SignatureInformation'][0]['Signature'][0]['SignedInfo'][0]
            ['Reference'][0]['DigestValue'][0]['_'] = $signedPropsDigest;

        // -------------------
        // STEP 4: Digest full document
        // -------------------
        $invoiceCanonicalJson = toCanonicalJson($invoiceData);
        $docDigest = base64_encode(hash('sha256', $invoiceCanonicalJson, true));

        $invoiceData['Invoice'][0]['UBLExtensions'][0]['UBLExtension'][0]['ExtensionContent'][0]
            ['UBLDocumentSignatures'][0]['SignatureInformation'][0]['Signature'][0]['SignedInfo'][0]
            ['Reference'][1]['DigestValue'][0]['_'] = $docDigest;

        // -------------------
        // STEP 5: Sign SignedInfo
        // -------------------
        $signedInfoPath = $invoiceData['Invoice'][0]['UBLExtensions'][0]['UBLExtension'][0]['ExtensionContent'][0]
            ['UBLDocumentSignatures'][0]['SignatureInformation'][0]['Signature'][0]['SignedInfo'][0];

        $signedInfoCanonicalJson = toCanonicalJson($signedInfoPath);

        openssl_sign($signedInfoCanonicalJson, $signature, $privateKey, OPENSSL_ALGO_SHA256);
        $sigValue = base64_encode($signature);

        $invoiceData['Invoice'][0]['UBLExtensions'][0]['UBLExtension'][0]['ExtensionContent'][0]
            ['UBLDocumentSignatures'][0]['SignatureInformation'][0]['Signature'][0]['SignatureValue'][0]['_'] = $sigValue;

        Log::info('completed signed xml document: ' . json_encode($invoiceData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

        $LatestjsonDocument = json_encode($invoiceData);
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

        dd($document);

        Log::debug('document: ', ['document' => $document]);

        if ($this->env === 'production') {
            $docsSubmitApi = 'https://preprod-api.myinvois.hasil.gov.my/api/v1.0/documentsubmissions';
        } else {
            $docsSubmitApi = 'https://preprod-api.myinvois.hasil.gov.my/api/v1.0/documentsubmissions';
        }

        $submiturl = Http::withToken($token)->post($docsSubmitApi, $document);

        if ($submiturl->successful()) {
            openssl_free_key($privateKey);
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

        // Generate QR code (you can encode invoice number, or a verification URL)
        // $qrCode = base64_encode(QrCode::format('png')->size(150)->generate($invoice->invoice_no));

        return Pdf::view('invoices.pdf', compact('invoice', 'merchant'))
            ->format('a4')
            ->name("invoice-{$invoice->invoice_no}.pdf")
            ->download(); 

    }

}
