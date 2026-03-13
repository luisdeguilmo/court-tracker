<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FolderTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('folder_types')->insert([
            ['name' => 'Civil Case', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Criminal Case', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Administrative Case', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Special Proceedings', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Archived Case', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
