<?php

return [
    'project_id' => 'required|integer|exists:projects,id',
    'title' => 'required|string|max:255',
    'description' => 'nullable|string',
];