<?php

return [
    'project_id' => 'required|integer|exists:projects,id',
    'start' => 'required|integer',
    'end' => 'required|integer|different:start',
];