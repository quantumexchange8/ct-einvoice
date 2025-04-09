<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    //

    protected $fillable = [
        'merchant_id',
        'token',
        'expired_at',
    ];
}
