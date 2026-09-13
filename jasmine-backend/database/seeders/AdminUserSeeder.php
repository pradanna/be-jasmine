<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@jasminesprei.com'],
            [
                'name'     => 'Admin Jasmine',
                'email'    => 'admin@jasminesprei.com',
                'password' => Hash::make('password'),
            ] 
        );
    }
}
