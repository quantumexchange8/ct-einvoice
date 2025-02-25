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
        'MSIC',
        'phone',
        'email',
        'sst',
        'businessActivity',
        'address1',
        'address2',
        'poscode',
        'area',
        'state',
        
    ];
}
