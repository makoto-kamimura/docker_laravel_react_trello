<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusesTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('statuses')->insert([
            ['id' => 1, 'name' => 'To Do', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'In Progress', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Done', 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}