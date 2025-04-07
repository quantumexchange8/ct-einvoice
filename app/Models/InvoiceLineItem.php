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

    public function classification(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->BelongsTo(Classification::class, 'classification_id', 'id');
    }
}
