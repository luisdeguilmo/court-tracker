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
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('uploaded_by')->constrained('users');
            $table->foreignId('folder_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('extension', 10);
            $table->bigInteger('size');
            $table->string('box_file_id')->unique();
            $table->string('document_type')->nullable();
            $table->boolean('is_sealed')->default(false);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};


