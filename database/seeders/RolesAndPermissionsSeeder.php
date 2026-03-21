<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // permissions
        $permissions = [
            'view cases',
            'create case',
            'edit case info',
            'upload documents',
            'delete documents',
            'organize records',
            // 'view all branch files',
            'access my drive',
            // 'approve documents',
            // 'finalize documents',
            'add annotations',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // roles
        $judge = Role::firstOrCreate(['name' => 'judge']);
        $clerk = Role::firstOrCreate(['name' => 'clerk of court']);

        // assign permissions
        $judge->givePermissionTo([
            'view cases',
            // 'approve documents',
            // 'finalize documents',
            'add annotations',
        ]);

        $clerk->givePermissionTo(Permission::all());
    }
}
