<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function index()
    {
        try{
        $tasks = Task::all()->groupBy('status');

        return response()->json([
            'columns' => [
                'todo' => [
                    'name' => 'To Do',
                    'items' => $tasks['todo'] ?? [],
                ],
                'inProgress' => [
                    'name' => 'In Progress',
                    'items' => $tasks['inProgress'] ?? [],
                ],
                'done' => [
                    'name' => 'Done',
                    'items' => $tasks['done'] ?? [],
                ],
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
    }
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'status' => 'string|in:todo,in_progress,done'
        ]);

        $task = Task::create([
            'content' => $request->content,
            'status' => $request->status ?? 'todo'
        ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:todo,in_progress,done',
        ]);

        $task = Task::findOrFail($id);
        $task->status = $request->status;
        $task->save();

        return response()->json(['message' => 'Task updated successfully', 'task' => $task]);
    }

}
