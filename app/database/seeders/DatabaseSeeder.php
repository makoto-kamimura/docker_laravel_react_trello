<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;

// Task::create(['content' => 'Task 1', 'status' => 'todo']);
// Task::create(['content' => 'Task 2', 'status' => 'todo']);
// Task::create(['content' => 'Task 3', 'status' => 'inProgress']);

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ProjectsSeeder::class,
            // TasksSeeder::class,
            TasksTableSeeder::class,
        ]);
    }
}