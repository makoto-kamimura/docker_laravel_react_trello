<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Task;
use App\Models\Status;
use Database\Seeders\StatusesTableSeeder;

class TaskFactoryTest extends TestCase
{
    use RefreshDatabase; // 🔹 データベースをリセット

    /** @test */
    public function it_can_generate_50_tasks()
    {
        // 🔹 テスト開始前にstatusesテーブルにデータをシード
        $this->seed(StatusesTableSeeder::class);

        // 🔹 50個のタスクを生成
        Task::factory()->count(50)->create();

        // 🔹 データが正しく挿入されたかチェック
        $this->assertEquals(50, Task::count());
    }
}
