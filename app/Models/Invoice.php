<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    // Mass assignable fields
    protected $fillable = [
        'invoice_no',
        'amount',
        'date',
        'type',
        'company_url',
        'business_registration',
        'full_name',
        'tin_no',
        'id_type',
        'id_no',
        'sst_no',
        'email',
        'contact',
        'addressLine1',
        'addressLine2',
        'addressLine3',
        'city',
        'postcode',
        'state',
        'country',
        'status',
        'business_registration',
    ];

    // Casting fields to specific data types (if needed)
    protected $casts = [
        'date' => 'date',
        'amount' => 'float',
        'contact' => 'integer',
        'postcode' => 'integer',
    ];
}
