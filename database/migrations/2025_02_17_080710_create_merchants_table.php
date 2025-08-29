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
        Schema::create('merchants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('merchant_uid');
            $table->string('registration_name');
            $table->string('irbm_client_id');
            $table->string('irbm_client_key');
            $table->string('onbehalfof')->nullable();
            $table->string('tin_no');
            $table->string('brn_no');
            $table->string('sst_no')->nullable();
            $table->string('ttx_no')->nullable();
            $table->unsignedBigInteger('msic_id');
            $table->string('classification_id');
            $table->string('business_activity')->nullable();
            $table->string('contact')->nullable();
            $table->string('address1');
            $table->string('address2')->nullable();
            $table->string('address3')->nullable();
            $table->string('postcode');
            $table->string('city');
            $table->string('state_code');
            $table->string('country_code');
            $table->string('email');
            $table->string('staging_url')->nullable();
            $table->string('live_url')->nullable();
            $table->string('appID');
            $table->string('role');
            $table->string('status');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchants');
    }
};
