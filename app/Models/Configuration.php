<?php

namespace App\Models;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Configuration extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $table = 'configurations'; 
    protected $fillable = [
        'invoicePrefix',
        'invoice',
        'companyName',
        'tin',
        'registration',
        'sst',
        'irbm_client_id',
        'irbm_client_key',
        'phone',
        'email',
        'MSIC',
        'defaultClassification',
        'businessActivity',
        'address1',
        'address2',
        'area',
        'poscode',
        'state',
        'country',
    ];
}
