<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FolderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('folders')->insert([
            [
                'user_id' => 1,
                'folder_type_id' => 1,
                'name' => 'Civil Case Folder 001',
                'case_number' => 'CIV-2024-001',
                'case_title' => 'Juan Dela Cruz vs Maria Santos',
                'case_status' => 'Open',
                'box_folder_id' => '123456789001',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'user_id' => 1,
                'folder_type_id' => 2,
                'name' => 'Criminal Case Folder 001',
                'case_number' => 'CRIM-2024-010',
                'case_title' => 'People of the Philippines vs Pedro Reyes',
                'case_status' => 'Pending',
                'box_folder_id' => '123456789002',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'user_id' => 1,
                'folder_type_id' => 3,
                'name' => 'Administrative Case Folder',
                'case_number' => 'ADM-2024-005',
                'case_title' => 'Office Complaint Investigation',
                'case_status' => 'Closed',
                'box_folder_id' => '123456789003',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
