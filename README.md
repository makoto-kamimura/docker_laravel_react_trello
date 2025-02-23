# Laravel+React Docker Application

## Project Structure

```
docker_laravel_react_trello
├── app(laravel Mix(react))
│   ├── app
│   │   ├── Console
│   │   │   └── 
│   │   ├── Exceptions
│   │   │   └── 
│   │   ├── Http
│   │   │   ├── Controllers 
│   │   │   │   ├─── Api
│   │   │   │   │   ├── StatusController.php
│   │   │   │   │   └── TaskController.php
│   │   │   │   └── Controller.php
│   │   │   ├── Middleware 
│   │   │   └── Requests
│   │   │   │   └── Task
│   │   │   │       ├── CreateTaskRequest.php
│   │   │   │       ├── ListTasksRequest.php
│   │   │   │       ├── ReorderTasksRequest.php
│   │   │   │       └── UpdateTaskRequest.php
│   │   │   └── Kernel.php
│   │   ├── Models
│   │   │   ├── Project.php ?
│   │   │   ├── Status.php 
│   │   │   ├── Task.php 
│   │   │   └── User.php ?
│   │   ├── Providers
│   │   │   └── 
│   │   └── Services
│   │   │   └── TaskService.php
│   ├── bootstrap
│   │   └── 
│   ├── config
│   │   └── 
│   ├── database
│   │   ├── factories
│   │   │   └── 
│   │   ├── migrations
│   │   │   ├── 000005_create_statuses_table.php
│   │   │   ├── 000006_create_tasks_table.php
│   │   │   └── 000100_add_status_id_to_tasks_table.php
│   │   ├── seeders
│   │   │   ├── DatabaseSeeder.php
│   │   │   ├── StatusesTableSeeder.php
│   │   │   └── TasksTableSeeder.php
│   │   └── .gitignore
│   ├── lang
│   │   └── 
│   ├── node_modules
│   │   └── 
│   ├── public
│   │   ├── css
│   │   ├── js
│   │   └── 
│   ├── resources
│   │   ├── css
│   │   ├── js
│   │   │   ├── components
│   │   │   │   ├─── App.tsx
│   │   │   │   ├─── Index.tsx
│   │   │   │   ├─── KanbanBoard.tsx
│   │   │   │   └─── LeftMenu.tsx
│   │   │   ├── app.js
│   │   │   └── bootstrap.js
│   │   ├── sass
│   │   │   ├── _variables.scss
│   │   │   ├── app.scss
│   │   │   └── leftmenu.scss
│   │   └── views
│   │   │   └── tasks
│   │           └─── index.blade.php
│   ├── routes
│   │   ├── api.php
│   │   ├── web.php
│   │   └── 
│   ├── storage
│   │   └── 
│   ├── tests
│   │   └── unit
│   │   │   └── TaskFactoryTest.php
│   ├── vender
│   │   └── 
│   ├── .editorconfig
│   ├── .env
│   ├── .env.example
│   ├── .gitattributes
│   ├── .gitignore
│   ├── .styleci.yml
│   ├── artisan
│   ├── composer.json
│   ├── composer.lock
│   ├── info.php
│   ├── package-lock.json
│   ├── package.json
│   ├── phpinit.xml
│   ├── README.md
│   ├── tsconfig.json
│   └── webpack.mix.js
├── db
│   └── 
├── docker
│   ├── app
│   │   ├── apache
│   │   │   └── 
│   │   ├── php
│   │   │   └── 
│   │   └── Dockerfile
│   └── db
│   │   ├── mysql
│   │   │   └── 
│   │   └── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Developer Unit Test
* 事前準備
```
docker compose up -d
```

* 単体テスト準備
```
docker exec -it docker_laravel_react_trello-app-1 bash
php artisan tinker
Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\StatusesTableSeeder']);
\App\Models\Task::factory()->count(50)->create();
Shift + G
Ctrl + C
```

* 50件実行テスト(実行後DBリセット)
```
docker exec -it docker_laravel_react_trello-app-1 bash
php artisan test --filter it_can_generate_50_tasks
```