<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'merchant_uid',
        'staging_url',
        'live_url',
        'appID',
        'role',
        'registration_name',
        'irbm_client_id',
        'irbm_client_key',
        'tin_no',
        'brn_no',
        'sst_no',
        'ttx_no',
        'msic_id',
        'classification_id',
        'address1',
        'address2',
        'address3',
        'city',
        'state_code',
        'country_code',
        'status',
        
    ];

}
