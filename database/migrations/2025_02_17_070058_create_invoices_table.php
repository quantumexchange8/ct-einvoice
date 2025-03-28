<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('merchant_id');
            $table->string('invoice_no');
            $table->string('amount'); 
            $table->date('date'); 
            $table->enum('type', ['Personal', 'Business'])->nullable();
            $table->string('company_url')->nullable(); 
            $table->string('business_registration')->nullable();
            $table->string('full_name')->nullable();
            $table->string('tin_no')->nullable();
            $table->string('id_type')->nullable();
            $table->string('id_no')->nullable();
            $table->string('sst_no')->nullable();
            $table->string('email')->nullable();
            $table->string('contact', 20); 
            $table->string('addressLine1')->nullable();
            $table->string('addressLine2')->nullable();
            $table->string('addressLine3')->nullable();
            $table->string('city')->nullable();
            $table->integer('postcode')->nullable(); 
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('status')->nullable();
            $table->string('invoice_status')->nullable();
            $table->string('invoice_uuid')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
