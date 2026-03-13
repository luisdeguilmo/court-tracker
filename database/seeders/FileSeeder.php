<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('files')->insert([
            [
                'uploaded_by' => 1,
                'folder_id' => 1,
                'name' => 'Complaint Document',
                'extension' => 'pdf',
                'size' => 204800,
                'box_file_id' => '987654321001',
                'document_type' => 'Complaint',
                'is_sealed' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'uploaded_by' => 1,
                'folder_id' => 1,
                'name' => 'Evidence Photo',
                'extension' => 'jpg',
                'size' => 102400,
                'box_file_id' => '987654321002',
                'document_type' => 'Evidence',
                'is_sealed' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'uploaded_by' => 1,
                'folder_id' => 2,
                'name' => 'Court Decision',
                'extension' => 'pdf',
                'size' => 307200,
                'box_file_id' => '987654321003',
                'document_type' => 'Decision',
                'is_sealed' => true,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
