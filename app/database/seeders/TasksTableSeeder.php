<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TasksTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('tasks')->insert([
            [
                'content' => 'タスク 1',
                'created_at' => now(),
                'updated_at' => now(),
                'status_id' => 1, // "To Do" のステータス ID
            ],
            [
                'content' => 'タスク 2',
                'created_at' => now(),
                'updated_at' => now(),
                'status_id' => 2, // "In Progress" のステータス ID
            ],
            [
                'content' => 'タスク 3',
                'created_at' => now(),
                'updated_at' => now(),
                'status_id' => 3, // "Done" のステータス ID
            ],
        ]);
    }
}

