<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RunningNumber extends Model
{
    protected $fillable = [
        'type',
        'prefix',
        'digit',
        'last_number',
    ];

    
}
