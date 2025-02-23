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
                'status_id' => 1,
                'description' => 'タスク 1 の詳細情報',
                'due_date' => now()->addDays(7)->format('Y-m-d'), // 🔹 7日後の期限
                'completed_at' => null, // 🔹 未完了なので NULL
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'タスク 2',
                'status_id' => 2,
                'description' => 'タスク 2 の詳細情報',
                'due_date' => now()->addDays(3)->format('Y-m-d'), // 🔹 3日後の期限
                'completed_at' => now()->subDay()->format('Y-m-d H:i:s'), // 🔹 昨日完了した
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'content' => 'タスク 3',
                'status_id' => 3,
                'description' => 'タスク 3 の詳細情報',
                'due_date' => now()->addDays(14)->format('Y-m-d'), // 🔹 14日後の期限
                'completed_at' => null, // 🔹 未完了
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
