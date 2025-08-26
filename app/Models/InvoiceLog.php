<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceLog extends Model
{
    protected $fillable = [
        'merchant_id',
        'invoice_no',
        'invoice_type',
        'invoice_no_json',
        'submit_date',
    ];
}
