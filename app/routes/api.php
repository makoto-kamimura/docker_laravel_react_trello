<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\StatusController;

// Route::group(['prefix' => '/tasks', 'as' => 'tasks.'], function () {
//     Route::get('/', [TaskController::class, 'list']);
//     Route::get('/{id}', [TaskController::class, 'get'])
// 		->where('id', '[1-9][0-9]*');
//     Route::post('/', [TaskController::class, 'store']);
//     Route::put('/{id}', [TaskController::class, 'update'])
//     	->where('id', '[1-9][0-9]*');
//     Route::delete('/{id}', [TaskController::class, 'delete'])
//     	->where('id', '[1-9][0-9]*');
//     Route::put('/', [TaskController::class, 'reorder']);
// });

Route::get('tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::patch('/tasks/{id}', [TaskController::class, 'update']);

Route::get('/statuses', [StatusController::class, 'index']);
Route::post('/statuses', [StatusController::class, 'store']);

Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
Route::delete('/statuses/{id}', [StatusController::class, 'destroy']);

Route::get('/tasks/{task}', [TaskController::class, 'show']);
Route::patch('/tasks/{id}/details', [TaskController::class, 'updateDetail']); // descriptionの更新
Route::patch('/statuses/{id}/name', [TaskController::class, 'updateStatusName']);


