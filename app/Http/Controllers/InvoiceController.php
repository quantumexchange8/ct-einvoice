<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceRequest;
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
        $msic = MSICcode::find($merchantDetail->msic_id);
        $state = State::where('State', $merchantDetail->state_code)->first();

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
                                        "Line" => [["_" => $invoice->addressLine2]]
                                    ],
                                    [
                                        "Line" => [["_" => $invoice->addressLine3]]
                                    ],
                                ],
                                "CityName" => [["_" => $invoice->city]],
                                "CountrySubentityCode" => [["_" => $invoice->state]],
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
                    "UBLExtensions" => [[
                        "UBLExtension" => [[
                            "ExtensionURI" => [[
                                "_" => "urn:oasis:names:specification:ubl:dsig:enveloped:xades"
                            ]],
                            "ExtensionContent" => [[
                                "UBLDocumentSignatures" => [[
                                    "SignatureInformation" => [[
                                        "ID" => [[
                                            "_" => "urn:oasis:names:specification:ubl:signature:1",
                                        ]],
                                        "ReferencedSignatureID" => [[
                                            "_" => "urn:oasis:names:specification:ubl:signature:Invoice"
                                        ]],
                                        "Signature" => [[
                                            "Id" => "signature",
                                            "Object" => [[
                                                "QualifyingProperties" => [[
                                                    "Target" => "signature",
                                                    "SignedProperties" => [[
                                                        "Id" => "id-xades-signed-props",
                                                        "SignedSignatureProperties" => [[
                                                            "SigningTime" => [[
                                                                "_" => "2024-07-23T15:14:54Z"
                                                            ]],
                                                            "SigningCertificate" => [[
                                                                "Cert" => [[
                                                                    "CertDigest" => [[
                                                                        "DigestMethod" => [[
                                                                            "_" => "",
                                                                            "Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256",
                                                                        ]],
                                                                        "DigestValue" => [[
                                                                            "_" => "KKBSTyiPKGkGl1AFqcPziKCEIDYGtnYUTQN4ukO7G40",
                                                                        ]],
                                                                    ]],
                                                                    "IssuerSerial" => [[
                                                                        "X509IssuerName" => [[
                                                                            "_" => "CN=Trial LHDNM Sub CA V1, OU=Terms of use at http://www.posdigicert.com.my, O=LHDNM, C=MY"
                                                                        ]],
                                                                        "X509SerialNumber" => [[
                                                                            "_" => "162880276254639189035871514749820882117"
                                                                        ]],
                                                                    ]],
                                                                ]]
                                                            ]],
                                                        ]]
                                                    ]]
                                                ]]
                                            ]],
                                            "KeyInfo" => [[
                                                "X509Certificate" => [[
                                                    "_" => "MIIFlDCCA3ygAwIBAgIQeomZorO+0AwmW2BRdWJMxTANBgkqhkiG9w0BAQsFADB1MQswCQYDVQQGEwJNWTEOMAwGA1UEChMFTEhETk0xNjA0BgNVBAsTLVRlcm1zIG9mIHVzZSBhdCBodHRwOi8vd3d3LnBvc2RpZ2ljZXJ0LmNvbS5teTEeMBwGA1UEAxMVVHJpYWwgTEhETk0gU3ViIENBIFYxMB4XDTI0MDYwNjAyNTIzNloXDTI0MDkwNjAyNTIzNlowgZwxCzAJBgNVBAYTAk1ZMQ4wDAYDVQQKEwVEdW1teTEVMBMGA1UEYRMMQzI5NzAyNjM1MDYwMRswGQYDVQQLExJUZXN0IFVuaXQgZUludm9pY2UxDjAMBgNVBAMTBUR1bW15MRIwEAYDVQQFEwlEMTIzNDU2NzgxJTAjBgkqhkiG9w0BCQEWFmFuYXMuYUBmZ3Zob2xkaW5ncy5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQChvfOzAofnU60xFO7NcmF2WRi+dgor1D7ccISgRVfZC30Fdxnt1S6ZNf78Lbrz8TbWMicS8plh/pHy96OJvEBplsAgcZTd6WvaMUB2oInC86D3YShlthR6EzhwXgBmg/g9xprwlRqXMT2p4+K8zmyJZ9pIb8Y+tQNjm/uYNudtwGVm8A4hEhlRHbgfUXRzT19QZml6V2Ea0wQI8VyWWa8phCIkBD2w4F8jG4eP5/0XSQkTfBHHf+GV/YDJx5KiiYfmB1nGfwoPHix6Gey+wRjIq87on8Dm5+8ei8/bOhcuuSlpxgwphAP3rZrNbRN9LNVLSQ5md41asoBHfaDIVPVpAgMBAAGjgfcwgfQwHwYDVR0lBBgwFgYIKwYBBQUHAwQGCisGAQQBgjcKAwwwEQYDVR0OBAoECEDwms66hrpiMFMGA1UdIARMMEowSAYJKwYBBAGDikUBMDswOQYIKwYBBQUHAgEWLWh0dHBzOi8vd3d3LnBvc2RpZ2ljZXJ0LmNvbS5teS9yZXBvc2l0b3J5L2NwczATBgNVHSMEDDAKgAhNf9lrtsUI0DAOBgNVHQ8BAf8EBAMCBkAwRAYDVR0fBD0wOzA5oDegNYYzaHR0cDovL3RyaWFsY3JsLnBvc2RpZ2ljZXJ0LmNvbS5teS9UcmlhbExIRE5NVjEuY3JsMA0GCSqGSIb3DQEBCwUAA4ICAQBwptnIb1OA8NNVotgVIjOnpQtowew87Y0EBWAnVhOsMDlWXD/s+BL7vIEbX/BYa0TjakQ7qo4riSHyUkQ+X+pNsPEqolC4uFOp0pDsIdjsNB+WG15itnghkI99c6YZmbXcSFw9E160c7vG25gIL6zBPculHx5+laE59YkmDLdxx27e0TltUbFmuq3diYBOOf7NswFcDXCo+kXOwFfgmpbzYS0qfSoh3eZZtVHg0r6uga1UsMGb90+IRsk4st99EOVENvo0290lWhPBVK2G34+2TzbbYnVkoxnq6uDMw3cRpXX/oSfya+tyF51kT3iXvpmQ9OMF3wMlfKwCS7BZB2+iRja/1WHkAP7QW7/+0zRBcGQzY7AYsdZUllwYapsLEtbZBrTiH12X4XnZjny9rLfQLzJsFGT7Q+e02GiCsBrK7ZHNTindLRnJYAo4U2at5+SjqBiXSmz0DG+juOyFkwiWyD0xeheg4tMMO2pZ7clQzKflYnvFTEFnt+d+tvVwNjTboxfVxEv2qWF6qcMJeMvXwKTXuwVI2iUqmJSzJbUY+w3OeG7fvrhUfMJPM9XZBOp7CEI1QHfHrtyjlKNhYzG3IgHcfAZUURO16gFmWgzAZLkJSmCIxaIty/EmvG5N3ZePolBOa7lNEH/eSBMGAQteH+Twtiu0Y2xSwmmsxnfJyw=="
                                                ]],
                                                "X509SubjectName" => [[
                                                    "_" => "CN=Trial LHDNM Sub CA V1, OU=Terms of use at http://www.posdigicert.com.my, O=LHDNM, C=MY",
                                                ]],
                                                "X509IssuerSerial" => [[
                                                    "X509IssuerName" => [[
                                                        "_" => "CN=Trial LHDNM Sub CA V1, OU=Terms of use at http://www.posdigicert.com.my, O=LHDNM, C=MY",
                                                    ]],
                                                    "X509SerialNumber" => [[
                                                        "_" => "162880276254639189035871514749820882117",
                                                    ]],
                                                ]]
                                            ]],
                                            "SignatureValue" => [[
                                                "_" => "QTvntg4opuS7ZYWmly/iAO2OnLVJcKylYuF+QJKZdx9BkFVglmVuFtEtwoqgNsbsKaaEDinTSUAVStRJs2tiU1Jdryd4hoZ/Hc5TAvFnThpauVOLsc3j07cUB1+zhNjENmFeI9yzTGjr8XfNi4mNPspnhFAT4QGbRpxkWiIsKj762p3dhCwUNAuNLjunVaosYQ5lvSzGt4B9TF/1xJ7Z6kdcJTmBeltTWErSRA2EOMzWsGWGZVvyPLnXfnlIBQItTvARXveafxFdS1iw91g7mSEEYeqEviI0b4FUmkwH8ed0boFc6EHl1VF+2uVxBtHeKf31FqTQl/6/pF4Qgpn6Hg=="
                                            ]],
                                            "SignedInfo" => [[
                                                "SignatureMethod" => [[
                                                    "_" => "",
                                                    "Algorithm" => "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"
                                                ]],
                                                "Reference" => [
                                                    [
                                                        "Type" => "http://uri.etsi.org/01903/v1.3.2#SignedProperties",
                                                        "URI" => "#id-xades-signed-props",
                                                        "DigestMethod" => [
                                                            [
                                                                "_" => "",
                                                                "Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256"
                                                            ]
                                                        ],
                                                        "DigestValue" => [
                                                            [
                                                                "_" => "Rzuzz+70GSnGBF1YxhHnjSzFpQ1MW4vyX/Q9bTHkE2c="
                                                            ]
                                                        ]
                                                    ],
                                                    [
                                                        "Type" => "",
                                                        "URI" => "",
                                                        "DigestMethod" => [
                                                            [
                                                                "_" => "",
                                                                "Algorithm" => "http://www.w3.org/2001/04/xmlenc#sha256"
                                                            ]
                                                        ],
                                                        "DigestValue" => [
                                                            [
                                                                "_" => "vMs/IdnS7isftqrBDr4F1LK/CkvBkW5Gb3Wn6OVzAxo="
                                                            ]
                                                        ]
                                                    ]
                                                ]
                                            ]]
                                        ]]
                                    ]]
                                ]]
                            ]],
                        ]]
                    ]],
                    "Signature" => [[
                        "ID" => [[
                            "_" => "urn:oasis:names:specification:ubl:signature:Invoice",
                        ]],
                        "SignatureMethod" => [[
                            "_" => "urn:oasis:names:specification:ubl:dsig:enveloped:xades"
                        ]]
                    ]],
                ]]
            ];

            // Step 2: Encode the JSON into Base64
            $jsonDocument = json_encode($invoiceData);
            $base64Document = base64_encode($jsonDocument);

            // Step 3: Generate the SHA-256 hash of the raw JSON
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
                $docsSubmitApi = 'https://preapi.myinvois.hasil.gov.my/api/v1.0/documentsubmissions';
            } else {
                $docsSubmitApi = 'https://preprod-api.myinvois.hasil.gov.my/api/v1.0/documentsubmissions';
            }

            $submiturl = Http::withToken($checkToken->token)->post($docsSubmitApi, $document);

            if ($submiturl->successful()) {
                Log::debug('submission ', $submiturl);

                // Normal Invoice
                $uuid = $submiturl['acceptedDocuments']['uuid'];

                $invoice->submitted_uuid = $uuid;
                $invoice->submitted_status = 'submitted';
                $invoice->save();

                $payout = PayoutConfig::where('merchant_id', $request->merchant_id)->first();
                $eCode = md5($invoice->invoice_no . $request->merchant_id . $payout->secret_key);

                $updateMerchantStatus = Http::post($payout->url . $payout->callBackUrl, [
                    'eCode' => $eCode,
                    'invoice_no' => $invoice->invoice_no,
                    'invoice_uuid' => $uuid,
                    'status' => 'submitted',
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
        }

        return redirect()->back();
    }
}
