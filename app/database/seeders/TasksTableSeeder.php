<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TasksTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tasks')->insert([
            ['content' => 'タスク 1', 'status' => 'todo', 'created_at' => now(), 'updated_at' => now()],
            ['content' => 'タスク 2', 'status' => 'inProgress', 'created_at' => now(), 'updated_at' => now()],
            ['content' => 'タスク 3', 'status' => 'done', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
