<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // DB::table('users')->insert([
        //     [
        //         'name' => 'Court Staff 1',
        //         'email' => 'staff1@court.gov.ph',
        //         'password' => Hash::make('password'),
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'name' => 'Court Staff 2',
        //         'email' => 'staff2@court.gov.ph',
        //         'password' => Hash::make('password'),
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ]
        // ]);      

        $user = User::firstOrCreate(
            ['email' => 'judge@example.com'],
            ['name' => 'Judge User', 'password' => bcrypt('password')],
            ['created_at' => now()],
            ['updated_at' => now()],
        );

        $user->assignRole('judge');

        $clerk = User::firstOrCreate(
            ['email' => 'clerk@example.com'],
            ['name' => 'Clerk User', 'password' => bcrypt('password')],
            ['created_at' => now()],
            ['updated_at' => now()],
        );

        $clerk->assignRole('clerk of court');
    }
}
