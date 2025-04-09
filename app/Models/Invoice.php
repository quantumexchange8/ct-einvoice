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
    // 3 = consolidated 已整合
    // 4 = pending_submit 等待提交

    // invoice_status
    // Submitted
    // Valid
    // Invalid
    // Cancelled

    // Mass assignable fields
    protected $fillable = [
        'invoice_no',
        'amount',
        'sst_amount',
        'service_tax',
        'total_amount',
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
        'submitted_uuid',
        'submitted_status',
        'remark',
    ];

    public function invoice_lines(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(InvoiceLineItem::class, 'invoice_id', 'id');
    }
}
