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
        Schema::create('states', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no');
            $table->string('amount'); 
            $table->date('date'); 
            $table->string('type'); 
            $table->string('company_url'); 
            $table->string('business_registration')->nullable();
            $table->string('full_name');
            $table->string('tin_no');
            $table->string('id_type')->nullable();
            $table->string('id_no')->nullable();
            $table->string('sst_no');
            $table->string('email');
            $table->integer('contact'); 
            $table->string('addressLine1');
            $table->string('addressLine2')->nullable();
            $table->string('addressLine3')->nullable();
            $table->string('city');
            $table->integer('postcode'); 
            $table->string('state');
            $table->string('country');
            $table->string(' '); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('states');
    }
};
