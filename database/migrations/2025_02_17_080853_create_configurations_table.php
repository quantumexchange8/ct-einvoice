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
        Schema::create('configurations', function (Blueprint $table) {
            $table->id();
            $table->string('invoicePrefix')->nullable();
            $table->integer('invoice')->nullable();
            $table->string('companyName');
            $table->string('tin');
            $table->integer('registration');
            $table->integer('irbm_client_id');
            $table->integer('irbm_client_key');
            $table->string('MSIC');
            $table->integer('phone');
            $table->string('email');
            $table->string('sst')->nullable();
            $table->string('address1');
            $table->string('address2')->nullable();
            $table->integer('poscode')->nullable();
            $table->string('area');
            $table->string('state');
            $table->string('businessActivity');
            $table->string('defaultClassification');
            $table->string('country');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configurations');
    }
};
