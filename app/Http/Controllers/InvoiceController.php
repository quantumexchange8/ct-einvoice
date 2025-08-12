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
                "ID" => [
                    ["_" => (string)($index + 1)] // Line item ID starting from 1
                ],
                "Item" => [
                    [
                        "CommodityClassification" => [
                            [
                                "ItemClassificationCode" => [
                                    [
                                        "_" => $item->classification->code,
                                        "listID" => "CLASS"
                                    ]
                                ]
                            ]
                        ],
                        "Description" => [
                            ["_" => $item->classification->description]
                        ]
                    ]
                ],
                "Price" => [
                    [
                        "PriceAmount" => [
                            [
                                "currencyID" => "MYR",
                                "_" => (float) number_format($item->item_price, 2, '.', ''), // Total Excluding Tax Amount
                            ]
                        ]
                    ]
                ],
                "TaxTotal" => [
                    [
                        "TaxSubtotal" => [
                            [
                                "TaxCategory" => [
                                    [
                                        "ID" => [["_" => "E"]],
                                        "TaxScheme" => [
                                            [
                                                "ID" => [
                                                    [
                                                        "_" => "OTH",
                                                        "schemeID" => "UN/ECE 5153",
                                                        "schemeAgencyID" => "6"
                                                    ]
                                                ]
                                            ]
                                        ],
                                        "TaxExemptionReason" => [
                                            ["_" => "Exempt New Means of Transport"]
                                        ]
                                    ]
                                ],
                                "TaxAmount" => [
                                    [
                                        "_" => 0,
                                        "currencyID" => "MYR"
                                    ]
                                ],
                                "TaxableAmount" => [
                                    [
                                        "_" => (float) number_format($item->item_price, 2, '.', ''),
                                        "currencyID" => "MYR"
                                    ]
                                ]
                            ]
                        ],
                        "TaxAmount" => [
                            [
                                "currencyID" => "MYR",
                                "_" => 0 // Total Excluding Tax Amount
                            ]
                        ]
                    ]
                ],
                "ItemPriceExtension" => [
                    [
                        "Amount" => [
                            [
                                "currencyID" => "MYR",
                                "_" => 100.00
                            ]
                        ]
                    ]
                ],
                "LineExtensionAmount" => [
                    [
                        "currencyID" => "MYR",
                        "_" => 1436.50
                    ]
                ]
            ];
        }

        $invoiceData = [
            "_D" => "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
            "_A" => "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
            "_B" => "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
            "Invoice" => [[
                "ID" => [["_" => $invoice->invoice_no]],
                "IssueDate" => [["_" => Carbon::now('UTC')->format('Y-m-d')]],
                "IssueTime" => [["_" => Carbon::now('UTC')->format('H:i:s')."Z"]],
                "InvoiceTypeCode" => [
                    [
                        "_" => "01",
                        "listVersionID" => "1.1"
                    ]
                ],
                "DocumentCurrencyCode" => [["_" => "MYR"]],
                "TaxCurrencyCode" => [["_" => "MYR"]],
                "AccountingSupplierParty" => [[
                    "Party" => [[
                        "PartyLegalEntity" => [[
                            "RegistrationName" => [["_" => $merchantDetail->name]]
                        ]],
                        "PartyIdentification" => [
                            [
                                "ID" => [[
                                    "_" => "C29802509040", // NEED CHANGE
                                    "schemeID" => "TIN"
                                ]]
                            ], [
                                "ID" => [[
                                    "_" => "202201017212", // NEED CHANGE
                                    "schemeID" => "BRN"
                                ]]
                            ], [
                                "ID" => [[
                                    "_" => $merchantDetail->sst_no ?? "NA",
                                    "schemeID" => "SST"
                                ]]
                            ], [
                                "ID" => [[
                                    "_" => "NA",
                                    "schemeID" => "TTX"
                                ]]
                            ]
                        ],
                        "IndustryClassificationCode" => [[
                            "name" => $msic->Description, // Business Activity Description
                            "_" => $msic->Code            // MSIC Code (if applicable)
                        ]],
                        "PostalAddress" => [[
                            "AddressLine" => [
                                [
                                    "Line" => [["_" => $merchantDetail->address1]]
                                ],
                                [
                                    "Line" => [["_" => $merchantDetail->address2 ?? ""]]
                                ],
                                [
                                    "Line" => [["_" => $merchantDetail->address3 ?? ""]]
                                ],
                            ],
                            "CityName" => [["_" => $merchantDetail->city]],
                            "CountrySubentityCode" => [["_" => $state->Code]],
                            "Country" => [[
                                "IdentificationCode" => [[
                                    "listID" => "ISO3166-1",
                                    "listAgencyID" => "6",
                                    "_" => "MYS"
                                ]]
                            ]]
                        ]],
                        "Contact" => [
                            [
                                "Telephone" => [["_" => $merchantDetail->contact]],
                                "ElectronicMail" => [["_" => $merchantDetail->email]]
                            ]
                        ]
                    ]]
                ]],
                "AccountingCustomerParty" => [[
                    "Party" => [[
                        "PartyLegalEntity" => [[
                            "RegistrationName" => [["_" => $invoice->full_name]]
                        ]],
                        "PartyIdentification" => [
                            [
                                "ID" => [[
                                    "schemeID" => "TIN",
                                    "_" => $invoice->tin_no,
                                ]]
                            ], 
                            [
                                "ID" => [[
                                    "schemeID" => "BRN",
                                    "_" => $invoice->id_no // NRIC(12 CHAR), PASSPORT(12 CHAR), BRN(20CHAR), ARMY(12 CHAR)
                                ]]
                            ],
                            [
                                "ID" => [[
                                    "schemeID" => "SST",
                                    "_" => $invoice->sst_no ?? null,
                                ]]
                            ],
                            [
                                "ID" => [[
                                    "schemeID" => "TTX",
                                    "_" => "NA"
                                ]]
                            ]
                        ],
                        "PostalAddress" => [[
                            "AddressLine" => [
                                [
                                    "Line" => [["_" => $invoice->addressLine1]]
                                ],
                                [
                                    "Line" => [["_" => $invoice->addressLine2 ?? ""]]
                                ],
                                [
                                    "Line" => [["_" => $invoice->addressLine3 ?? ""]]
                                ],
                            ],
                            "CityName" => [["_" => $invoice->city]],
                            "CountrySubentityCode" => [["_" => $state->Code]],
                            "Country" => [[
                                "IdentificationCode" => [[
                                    "_" => "MYS",
                                    "listID" => "ISO3166-1",
                                    "listAgencyID" => "6"
                                ]]
                            ]]
                        ]],
                        "Contact" => [
                            [
                                "Telephone" => [["_" => $invoice->contact ]],
                                "ElectronicMail" => [["_" => $invoice->email ]]
                            ],
                        ]
                    ]]
                ]],
                "LegalMonetaryTotal" => [
                    [
                        // Required
                        "TaxExclusiveAmount" => [[
                            "_" => (float) number_format($invoice->amount, 2, '.', ''),  // Total Excluding Tax Amount
                            "currencyID" => "MYR"  // Currency Code
                        ]],
                        "TaxInclusiveAmount" => [[
                            "_" => (float) number_format($invoice->total_amount, 2, '.', ''),  // Total Excluding Tax Amount
                            "currencyID" => "MYR"  // Currency Code
                        ]],
                        "PayableAmount" => [[
                            "_" => (float) number_format($invoice->total_amount, 2, '.', ''),  // Total Excluding Tax Amount
                            "currencyID" => "MYR"  // Currency Code
                        ]],

                        // optional
                        // "LineExtensionAmount" => [[
                        //     "_" => 1436.50,  // Total Excluding Tax Amount
                        //     "currencyID" => "MYR"  // Currency Code
                        // ]],
                        // "PayableRoundingAmount" => [[
                        //     "_" => 1436.50,  // Total Excluding Tax Amount
                        //     "currencyID" => "MYR"  // Currency Code
                        // ]],
                        // "AllowanceTotalAmount" => [[
                        //     "_" => 1436.50,  // Total Excluding Tax Amount
                        //     "currencyID" => "MYR"  // Currency Code
                        // ]],
                        // "ChargeTotalAmount" => [[
                        //     "_" => 1436.50,  // Total Excluding Tax Amount
                        //     "currencyID" => "MYR"  // Currency Code
                        // ]]
                    ]
                ],
                "TaxTotal" => [
                    [
                        "TaxAmount" => [[
                            "_" => ($invoice->sst_amount + $invoice->service_tax),
                            "currencyID" => "MYR"
                        ]],
                        "TaxSubtotal" => [[
                            "TaxableAmount" => [[
                                "_" => ($invoice->sst_amount + $invoice->service_tax),
                                "currencyID" => "MYR"
                            ]],
                            "TaxAmount" => [[
                                "_" => ($invoice->sst_amount + $invoice->service_tax),
                                "currencyID" => "MYR"
                            ]],
                            "TaxCategory" => [[
                                "ID" => [["_" => "01"]],
                                "TaxScheme" => [[
                                    "ID" => [[
                                        "_" => "OTH",
                                        "schemeID" => "UN/ECE 5153",
                                        "schemeAgencyID" => "6",
                                    ]]
                                ]],
                            ]]
                        ]]
                    ]
                ],
                "InvoiceLine" => $invoiceLines,
            ]]
        ];

        $jsonDocument = json_encode($invoiceData);
        $base64Document = base64_encode($jsonDocument);

        Log::info('json', [
            'jsonDocument' => $jsonDocument,
            'base64Document' => $base64Document,
        ]);
        
        function canonicalizeJson($data) {
            if (is_array($data)) {
                if (array_keys($data) !== range(0, count($data) - 1)) {
                    ksort($data); // Sort keys alphabetically
                }
                foreach ($data as &$value) {
                    $value = canonicalizeJson($value);
                }
            }
            return $data;
        }

        $canonicalData = canonicalizeJson($invoiceData); // before adding UBLExtensions

        $canonicalJson = json_encode($canonicalData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        Log::debug('canonicalJson: ' . $canonicalJson);

        // SHA-256 binary hash
        $binaryHash = hash('sha256', $canonicalJson, true);

        // Step 3: Generate the SHA-256 hash of the raw JSON
        $documentHash = hash('sha256', $binaryHash);

        // Convert binary hash → HEX string
        $hexHash = bin2hex($binaryHash);

        // Convert HEX string → Base64
        $docDigest = base64_encode(hex2bin($hexHash));

        // Load PFX file from storage
        $pfxFile = storage_path('certs/signing.pfx');
        $p12Password = env('PRIVATE_KEY_PASS');
        $p12Content = file_get_contents($pfxFile);

        $certs = [];
        if (!openssl_pkcs12_read($p12Content, $certs, $p12Password)) {
            if ($error = openssl_error_string()) {
                Log::error('Detailed error message', ['error' => $error]);
            }
            throw new \Exception("Unable to read PFX file or incorrect password.");
        }

        // The private key
        $privateKey = openssl_pkey_get_private($certs['pkey']);
        Log::info('private key', ['private key' => $privateKey]);

        $dataToSign = $binaryHash;

        $signature = '';
        if (!openssl_sign($dataToSign, $signature, $privateKey, OPENSSL_ALGO_SHA256)) {
            throw new \Exception("Unable to read PFX file or incorrect password.");
        }

        // Convert binary signature to Base64 (Sig)
        $sig = base64_encode($signature);
        Log::debug('Sig: ' . $sig);

        $cleanCert = str_replace(
            ["-----BEGIN CERTIFICATE-----", "-----END CERTIFICATE-----", "\r", "\n"],
            '',
            $certs['cert']
        );
        $derCert = base64_decode($cleanCert);

        $certHashBase64 = base64_encode(hash('sha256', $derCert, true));

        $signingTime = Carbon::now('UTC')->format('Y-m-d\TH:i:s\Z');

        $certInfo = openssl_x509_parse($certs['cert']);
        $issuerName = '';
        foreach ($certInfo['issuer'] as $key => $value) {
            $issuerName .= strtoupper($key) . '=' . $value . ',';
        }

        $serialNumber = $certInfo['serialNumber']; // decimal

        $signatureBlock = [
            "UBLExtensions" => [[
                "UBLExtension" => [[
                    "ExtensionContent" => [[
                        "UBLDocumentSignatures" => [[
                            "SignatureInformation" => [[
                                "Signature" => [[
                                    "ID" => "urn:oasis:names:specification:ubl:signature:Invoice",
                                    "Object" => [[
                                        "QualifyingProperties" => [[
                                            "Target" => "signature",
                                            "SignedProperties" => [[
                                                "ID" => "id-xades-signed-props",
                                                "SignedSignatureProperties" => [[
                                                    "SigningTime" => [[
                                                        "_" => $signingTime,
                                                    ]],
                                                    "SigningCertificate" => [[
                                                        "Cert" => [[
                                                            "CertDigest" => [[
                                                                "DigestMethod" => [[
                                                                    "_" => "",
                                                                    "Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256"
                                                                ]],
                                                                "DigestValue" => [[
                                                                    "_" => $certHashBase64,
                                                                ]],
                                                            ]],
                                                            "IssuerSerial" => [[
                                                                "X509IssuerName" => [[
                                                                    "_" => $issuerName,
                                                                ]],
                                                                "X509SerialNumber" => [[
                                                                    "_" => $serialNumber,
                                                                ]]
                                                             ]]
                                                        ]]
                                                    ]]
                                                ]]
                                            ]]
                                        ]]
                                    ]],
                                    "SignedInfo" => [[
                                        "CanonicalizationMethod" => [[
                                            "@Algorithm" => "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
                                        ]],
                                        "SignatureMethod" => [[
                                            "_" => "",
                                            "@Algorithm" => "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"
                                        ]],
                                        "Reference" => [
                                            [
                                                "@Id" => "id-doc-signed-data",
                                                "@URI" => "",
                                                "DigestMethod" => [[
                                                    "@Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256"
                                                ]],
                                                "DigestValue" => [["_"=> $docDigest]]
                                            ],
                                            [
                                                "@URI" => "#id-xades-signed-props",
                                                "DigestMethod" => [[
                                                    "@Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256"
                                                ]],
                                                "DigestValue" => [["_"=> $docDigest]] // From your SignedProperties
                                            ]
                                        ]
                                    ]],
                                    "SignatureValue" => [["_"=> $sig]],
                                    "KeyInfo" => [[
                                        "X509Data" => [[
                                            "X509Certificate" => [["_"=> $cleanCert]],
                                            "X509SubjectName" => [["_"=> $issuerName]],
                                            "X509IssuerSerial" => [[
                                                "X509IssuerName" => [[
                                                    "_" => $issuerName,
                                                ]],
                                                "X509SerialNumber" => [[
                                                    "_" => $serialNumber
                                                ]]
                                            ]],
                                        ]]
                                    ]]
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

        $invoiceData['Invoice'][0] = array_merge($invoiceData['Invoice'][0], $signatureBlock);

        $finalJson = json_encode($invoiceData);

        Log::info('final', [
            'finajson' => $finalJson,
        ]);

        $document = [
            'documents' => [
                [
                    'format' => 'JSON',
                    'document' => base64_encode($finalJson),
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
}
