<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Status;
use Illuminate\Validation\ValidationException;

class StatusController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Status::all());
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:statuses,name|max:255',
            ]);

            $status = Status::create(['name' => $request->input('name')]);

            return response()->json($status, 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create status'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $status = Status::find($id);

        if (!$status) {
            return response()->json(['message' => 'Status not found'], 404);
        }

        // **リレーションが存在する場合のみ実行**
        if (method_exists($status, 'tasks')) {
            $status->tasks()->delete();
        }

        $status->delete();

        return response()->json(['message' => 'Status deleted successfully'], 200);
    }
}