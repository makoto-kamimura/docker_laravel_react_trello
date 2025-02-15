<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config("app.name") }}</title>
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" />
    <link rel="stylesheet" href="{{ mix('/css/app.css') }}" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body>
<div id="app" data-projects="{{ json_encode($projects) }}"></div>
    <div id="app-box">
        <h1>Welcome to the Kanban Tool</h1>
        <p>Your project management solution.</p>
        <div id="kanban-board"></div>
    </div>
    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>