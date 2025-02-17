<?php

return [
    'title' => 'required|string|max:255',
    'status_id' => 'required|exists:statuses,id',
    'description' => 'nullable|string',
];