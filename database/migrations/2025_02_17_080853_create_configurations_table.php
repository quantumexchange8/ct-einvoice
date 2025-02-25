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
            $table->string('invoicePrefix');
            $table->integer('invoice');
            $table->string('companyName');
            $table->string('tin');
            $table->integer('registration');
            $table->string('MSIC');
            $table->integer('phone');
            $table->string('email');
            $table->string('sst');
            $table->string('address1');
            $table->string('address2');
            $table->integer('poscode');
            $table->string('area');
            $table->string('state');
            $table->string('businessActivity');
            $table->string('defaultClassification');
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
