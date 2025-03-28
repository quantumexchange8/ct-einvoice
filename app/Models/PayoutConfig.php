<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayoutConfig extends Model
{

    protected $fillable = [
        'merchant_id',
        'env',
        'url',
        'callBackUrl',
        'secret_key',
    ];
    
    public function merchant(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->BelongsTo(Merchant::class, 'merchant_id', 'id');
    }
}
