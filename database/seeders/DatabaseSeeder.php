<?php

namespace Database\Seeders;

use App\Models\RunningNumber;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            CountrySeeder::class,
            StateSeeder::class,
            
        ]);

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'role' => 'admin',
            'password' => 'testtest'
        ]);

        RunningNumber::create([
            'type' => 'merchant',
            'prefix' => 'M',
            'digit' => '4',
            'last_number' => '0',
        ]);
        
    }
}
