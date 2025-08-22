<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceError extends Model
{
    protected $fillable = [
        'invoice_id',
        'error_step',
        'error_code',
        'error_message',
    ];

    

}
