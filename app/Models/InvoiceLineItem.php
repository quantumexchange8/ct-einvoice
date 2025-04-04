<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceLineItem extends Model
{
    //
    protected $fillable = [
        'invoice_id',
        'item_name',
        'item_qty',
        'item_price',
        'classification_id',
        'subtotal',
    ];
}
