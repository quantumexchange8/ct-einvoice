<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;


class StateSeeder extends Seeder
{

    public function run(): void
    {
        $jsonFilePath = base_path('database/seeders/state.json');
        
        // Read JSON file
        $json = File::get($jsonFilePath);
        
        // Decode JSON data into an array
        $data = json_decode($json, true);

        // Insert data into the database
        DB::table('states')->insert($data);
    }
}
