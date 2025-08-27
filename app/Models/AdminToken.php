<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminToken extends Model
{
    protected $fillable = [
        'token',
        'expired_at',
    ];
    
}
