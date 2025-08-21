<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; display: flex; }
        .invoice-box { width: 100%; padding: 10px; }
        .header-table, .content-table, .info-table, .items-table { width: 100%; border-collapse: collapse; }
        .header-table td, .content-table td, .info-table td { vertical-align: top; }
        .merchant-name { font-size: 14px; font-weight: bold; }
        .submission-uid { font-size: 12px; }
        .items-table th, .items-table td { border: 1px solid #d0d0d0; padding: 4px; font-size: 10px; }
        .items-table th { background-color: #000000; color: #ffffff; text-align: center; }
        .items-table td { text-align: center; }
        .right { text-align: right; }
        .left { text-align: left; }
        .bold { font-weight: bold; }
    </style>
</head>
<body>
    <div class="invoice-box">
        {{-- Header --}}
        <table class="header-table">
            <tr>
                <td>
                    <img src="{{ public_path('assets/image/logo.png') }}" alt="Logo" style="width:150px; height:auto;">
                </td>
                <td style="font-size:20px; font-weight:bold; text-align:right">Invoice {{ $invoice->invoice_no }}</td>
            </tr>
            <tr>
                <td style="height: 4px"></td>
            </tr>
            <tr>
                <td>
                    <div class="merchant-name">{{ $merchant->name }}</div>
                    <div style="max-width:250px">Address: {{ $merchant->address1 }}, {{ $merchant->address2 ? $merchant->address2 . ',' : '' }} {{ $merchant->postcode }} {{ $merchant->state_code}}, {{ $merchant->country_code === 'MYS' ? 'Malaysia' : ''}}</div>
                    <div>Reg.No: {{ $merchant->brn_no }}</div>
                    <div>Contact: {{ $merchant->contact }}</div>
                    <div>Email: {{ $merchant->email }}</div>
                </td>
                <td class="right">
                    <div class="submission-uid">E-Invoice Version: 1.0</div>
                    <div class="submission-uid">Submission UID: {{ $invoice->submission_uuid }}</div>
                    <div class="submission-uid">UUID: {{ $invoice->invoice_uuid }}</div>
                    <div class="submission-uid">Issue Date&Time: {{ $invoice->updated_at }}</div>
                </td>
            </tr>
        </table>

        {{-- Invoice Status --}}
        <table class="content-table" style="margin:20px 0;">
            <tr>
                <td class="right" style="font-size:30px; font-weight:bold; color: {{ $invoice->invoice_status === 'Valid' ? 'green' : 'red' }};">
                    {{ ucfirst($invoice->invoice_status) }}
                </td>
            </tr>
        </table>

        {{-- Supplier & Buyer --}}
        <table class="info-table" style="margin-bottom:20px;">
            <tr>
                <td>
                    <div style="font-size:16px; font-weight:bold;">Supplier</div>
                    <div>Supplier TIN: {{ $merchant->tin_no }}</div>
                    <div>Supplier Name: {{ $merchant->name }}</div>
                    <div>Supplier Registration Number: {{ $merchant->brn_no }}</div>
                    <div>Supplier SST ID: {{ $merchant->sst_no ?? 'NA' }}</div>
                    <div>Supplier Business activity description: {{ $merchant->business_activity ?? 'NA' }}</div>
                    <div>Supplier Contact: {{ $merchant->contact }}</div>
                    <div>Supplier MSIC: {{ $merchant->msic->Code }}</div>
                </td>
                <td class="right">
                    <div style="font-size:16px; font-weight:bold;">Buyer</div>
                    <div>Buyer TIN: {{ $invoice->tin_no }}</div>
                    <div>Buyer Name: {{ $invoice->full_name }}</div>
                    @if($invoice->type === 'Personal') 
                        <div>Buyer Identity: {{ $invoice->id_no }}</div>
                    @else
                        <div>Buyer BRN: {{ $invoice->business_registration }}</div>
                    @endif
                    <div style="">Buyer Address: {{ $invoice->addressLine1 }}, {{ $invoice->addressLine2 ? $invoice->addressLine2.',' : '' }} {{ $invoice->postcode }} {{ $invoice->city }}, {{ $invoice->country }}</div>
                    <div>Buyer Email: {{ $invoice->email }}</div>
                </td>
            </tr>
        </table>

        {{-- Items --}}
        <table class="items-table">
            <thead>
                <tr>
                    <th>Classification</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                    <th>Disc</th>
                    <th>Tax Rate</th>
                    <th>Tax Amount</th>
                    <th>Total Product / Service</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->invoice_lines as $item)
                    <tr>
                        <td>{{ $item->classification->code }}</td>
                        <td class="left">{{ $item->item_name }}</td>
                        <td>{{ $item->item_qty }}</td>
                        <td class="right">RM {{ number_format($item->item_price, 2) }}</td>
                        <td class="right">RM {{ number_format($item->item_price * $item->item_qty, 2) }}</td>
                        <td>-</td>
                        <td>RM {{ number_format($item->tax_rate, 2) }}</td>
                        <td class="right">RM {{ number_format($item->tax_amount, 2) }}</td>
                        <td class="right">RM {{ number_format($item->subtotal, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="right bold">Subtotal:</td>
                    <td class="right bold">RM {{ number_format($invoice->amount, 2) }}</td>
                    <td>-</td>
                    <td></td>
                    <td class="right bold">RM {{ number_format($invoice->sst_amount, 2) }}</td>
                    <td class="right bold">RM {{ number_format($invoice->amount + $invoice->sst_amount, 2) }}</td>
                </tr>
                <tr>
                    <td colspan="8" class="right bold">Total excluding tax:</td>
                    <td class="right bold">RM {{ number_format($invoice->amount, 2) }}</td>
                </tr>
                <tr>
                    <td colspan="8" class="right bold">Tax Amount:</td>
                    <td class="right bold">RM {{ number_format($invoice->sst_amount, 2) }}</td>
                </tr>
                <tr>
                    <td colspan="8" class="right bold">Total Including tax:</td>
                    <td class="right bold">RM {{ number_format($invoice->amount + $invoice->sst_amount, 2) }}</td>
                </tr>
                <tr>
                    <td colspan="8" class="right bold">Total Amount:</td>
                    <td class="right bold">RM {{ number_format($invoice->amount + $invoice->sst_amount, 2) }}</td>
                </tr>
            </tfoot>
        </table>

        <div class="bold" style="margin-top:20px;">
            Date and Time of Validation: {{ $invoice->invoice_datetime ?? 'N/A' }}
        </div>
        <div class="bold" style="margin-top:10px;">
            This document is a visual presentation of the e-invoice.
        </div>
    </div>
</body>
</html>
