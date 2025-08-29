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
        Schema::create('invoice_line_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->string('item_name');
            $table->string('item_qty');
            $table->decimal('item_price', 13, 2)->default(0);
            $table->integer('tax_rate')->default(0);
            $table->decimal('tax_amount', 13, 2)->default(0);
            $table->decimal('subtotal', 13, 2)->default(0);
            $table->unsignedBigInteger('classification_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_line_items');
    }
};
