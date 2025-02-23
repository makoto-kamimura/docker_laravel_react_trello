<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Task;
use App\Models\Status;
use Illuminate\Support\Carbon;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        // 現在の日付から1ヶ月前までのランダムな日付を設定
        $startDate = Carbon::now()->subMonth(); // 現在日付から1ヶ月前
        $endDate = Carbon::now(); // 現在の日付

        // due_dateは現在日付から3ヶ月後までの範囲でランダム設定
        $dueDateStart = Carbon::now(); // 現在日付
        $dueDateEnd = $dueDateStart->copy()->addMonths(3); // 現在日付から3ヶ月後

        return [
            'content' => $this->faker->sentence,
            'status_id' => Status::inRandomOrder()->first()->id, // ステータスIDをstatusesテーブルからランダムに選択
            'description' => $this->faker->paragraph,
            'due_date' => $this->faker->dateTimeBetween($dueDateStart, $dueDateEnd)->format('Y-m-d'), // 現在日付から3ヶ月後までの範囲でランダムな日付
            'created_at' => $this->faker->dateTimeBetween($startDate, $endDate)->format('Y-m-d'), // 現在日付から1ヶ月前までの範囲でランダムな日付
            'completed_at' => $this->faker->optional(0.3)->dateTime, // 30%の確率で完了済みにする
        ];
    }
}
