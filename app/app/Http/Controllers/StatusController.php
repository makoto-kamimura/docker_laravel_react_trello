<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Status;
use Illuminate\Validation\ValidationException;

class StatusController extends Controller
{
    public function index()
    {
        return response()->json(Status::all());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:statuses,name|max:255',
            ]);

            $status = Status::create(['name' => $request->name]);

            return response()->json($status, 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create status'], 500);
        }
    }
}
