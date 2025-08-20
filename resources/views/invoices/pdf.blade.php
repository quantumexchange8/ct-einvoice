<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: DejaVu Sans, sans-serif; display: flex; }
        .invoice-box { width: 100%; padding: 20px; }
        .qr { margin-top: 20px; }
        .header { 
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 10px;
        }
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
        .merchant-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 4px;
            max-width: 300px;
        }
        .merchant-name {
            font-size: 14px;
            font-weight: 700;
        }
        .merchant-flex {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 8px;
        }
        .merchant-details {
            font-size: 12px;
        }
        .submission-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;
            gap: 4px;
        }
        .submission-uid {
            font-size: 12px;
            font-weight: 500;
        }
        .content-1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .content-2 {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        .supplier-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 4px;
        }
        .buyer-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;
            gap: 4px;
        }
        table, td, th {
            border: 1px solid #d0d0d0;
        }

        table {
            border-collapse: collapse;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <div class="header-content">
                <div>
                    <img src="{{ public_path('assets/image/logo.png') }}" alt="Logo" style="width: 150px; height: auto;">
                </div>
                <div class="header-text" style="font-size: 16px; font-weight: bold; ">
                    E-INVOICE
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; width: 100%">
                <div class="merchant-info">
                    <div class="merchant-name">{{ $merchant->name }}</div>
                    <div class="merchant-flex">
                        <div class="merchant-details">Address: {{ $merchant->address1 }}, {{ $merchant->address2 ? $merchant->address2 . ',' : null }} {{ $merchant->postcode }} {{ $merchant->state_code}}, {{ $merchant->country_code === 'MYS' ? "Malaysia" : ""}} </div>

                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <div class="merchant-details">Reg.No: {{ $merchant->brn_no }} </div>
                            <div class="merchant-details">Contact: {{ $merchant->contact }} </div>
                            <div class="merchant-details">Email: {{ $merchant->email }} </div>
                        </div>
                    </div>
                </div>
                <div class="submission-info">
                    <div style="font-size: 20px; font-weight:700">Invoice {{ $invoice->invoice_no }}</div>
                    <div class="submission-uid">E-Invoice Version: 1.0</div>
                    <div class="submission-uid">Submission UID: {{ $invoice->submission_uuid }}</div>
                    <div class="submission-uid">UUID: {{ $invoice->invoice_uuid }}</div>
                    {{-- <div class="submission-uid">Amount: RM {{ number_format($invoice->amount, 2) }}</div> --}}
                    <div class="submission-uid">Issue Date&Time: {{ $invoice->updated_at }}</div>
                </div>
            </div>
            
        </div>

        <div class="content-1">
            <div></div>

            <div style="font-size: 30px; text-transform:uppercase; font-weight:700; text-align: center; color: {{ $invoice->invoice_status === 'Valid' ? 'green' : 'red' }};">
                {{ ucfirst($invoice->invoice_status) }}
            </div>
        </div>
        
        <div class="content-2">
            <div class="supplier-info">
                <div style="font-size: 20px; font-weight:700">Supplier</div>
                <div class="submission-uid">Supplier TIN: {{ $merchant->tin_no }}</div>
                <div class="submission-uid">Supplier Name: {{ $merchant->name }}</div>
                <div class="submission-uid">Supplier Registration Number: {{ $merchant->brn_no }}</div>
                <div class="submission-uid">Supplier SST ID: {{ $merchant->sst_no ?? 'NA' }}</div>
                <div class="submission-uid">Supplier Business Address: {{ $merchant->brn_no }}</div>
                <div class="submission-uid">Supplier Contact: {{ $merchant->contact }}</div>
                <div class="submission-uid">Supplier MSIC: {{ $merchant->msic->Code }}</div>
            </div>
            <div class="buyer-info">
                <div style="font-size: 20px; font-weight:700">Buyer</div>
                <div class="submission-uid">Buyer TIN: {{ $invoice->tin_no }}</div>
                <div class="submission-uid">Buyer Name: {{ $invoice->full_name }} </div>
                @if($invoice->type === 'Personal') 
                    <div class="submission-uid">Buyer Identity: {{ $invoice->id_no }}</div>
                @else
                    <div class="submission-uid">Buyer BRN: {{ $invoice->business_registration }}</div>
                @endif
                <div class="submission-uid" style="max-width:300px" >Buyer Address: {{ $invoice->addressLine1 }},{{ $invoice->addressLine2 ? "$invoice->addressLine1," : null}} {{$invoice->postcode }} {{ $invoice->city}}, {{ $invoice->country }} </div>
                <div class="submission-uid">Buyer Email: {{ $invoice->email }} </div>
            </div>
        </div>

        <table style="width: 100%; ">
            <thead>
                <tr style="background-color: #000000;color: #ffffff; font-size: 12px;">
                    <th style="text-align: center;padding: 8px 4px;">Classification</th>
                    <th style="text-align: center;padding: 8px 4px;">Description</th>
                    <th style="text-align: center;padding: 8px 4px;">Quantity</th>
                    <th style="text-align: center;padding: 8px 4px;">Unit Price</th>
                    <th style="text-align: center;padding: 8px 4px;">Amount</th>
                    <th style="text-align: center;padding: 8px 4px;">Disc</th>
                    <th style="text-align: center;padding: 8px 4px;">Tax Rate</th>
                    <th style="text-align: center;padding: 8px 4px;">Tax Amount</th>
                    <th style="text-align: center;padding: 8px 4px;">Total Product / Service</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->invoice_lines as $item)
                    <tr>
                        <td style="text-align: center; font-size:12px">{{ $item->classification->code }}</td>
                        <td style="text-align: left; font-size:12px">{{ $item->item_name }}</td>
                        <td style="text-align: center; font-size:12px">{{ $item->item_qty }}</td>
                        <td style="text-align: right; font-size:12px">RM {{ number_format($item->item_price, 2) }}</td>
                        <td style="text-align: right; font-size:12px">RM {{ number_format($item->item_price * $item->item_qty, 2) }}</td>
                        <td style="text-align: center; font-size:12px">-</td>
                        <td style="text-align: center; font-size:12px">RM {{ number_format($item->tax_rate, 2) }}</td>
                        <td style="text-align: right; font-size:12px">RM {{ number_format($item->tax_amount, 2) }}</td>
                        <td style="text-align: right; font-size:12px">RM {{ number_format($item->subtotal, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" style="text-align: right; font-weight: bold;">Subtotal:</td>
                    <td style="text-align: right; font-weight: bold;font-size:12px">RM {{ number_format($invoice->amount, 2) }}</td>
                    <td style="text-align: center; font-size:12px">-</td>
                    <td></td>
                    <td style="text-align: right; font-weight: bold;font-size:12px">RM {{ number_format($invoice->sst_amount, 2) }}</td>
                    <td style="text-align: right; font-weight: bold;font-size:12px">RM {{ number_format($invoice->amount + $invoice->sst_amount, 2) }}</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: right; font-weight: bold;">Total excluding tax:</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style="text-align: right; font-weight: bold;font-size:12px">RM {{ number_format($invoice->amount, 2) }}</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: right; font-weight: bold;">Tax Amount:</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style="text-align: right; font-weight: bold;font-size:12px">RM {{ number_format($invoice->sst_amount, 2) }}</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: right; font-weight: bold;">Total Including tax:</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style="text-align: right; font-weight: bold;font-size:12px">RM {{ number_format($invoice->amount + $invoice->sst_amount, 2) }}</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: right; font-weight: bold;">Total Amount:</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style="text-align: right; font-weight: bold;font-size:12px">RM {{ number_format($invoice->amount + $invoice->sst_amount, 2) }}</td>
                </tr>
            </tfoot>
        </table>
        
        <div style="font-weight: bold;font-size:12px; margin-top: 20px;">
            Date and Time of Validatation: {{ $invoice->invoice_datetime ?? 'N/A' }}
        </div>
    </div>
</body>
</html>
