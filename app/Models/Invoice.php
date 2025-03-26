<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    // status
    // 1 = pending default
    // 2 = void 廢止
    // 3 = validated 已核实
    // 3 = submitted 已提交
    // 4 = consolidated 已整合
    // 5 = rejected 已拒绝

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
        'invoice_status',
        'business_registration',
        'merchant_id',
    ];
}
