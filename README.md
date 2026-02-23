# Tasks API

A Node.js REST API for task management using pure Node.js (no frameworks). Data is persisted in a local JSON file.

## Getting Started

```bash
npm install
npm start
```

The server runs on `http://localhost:3000`.

## Routes

### POST /tasks

Creates a new task.

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "My Task", "description": "Task description"}'
```

### GET /tasks

Lists all tasks. Supports filtering by `title` and `description` via query param.

```bash
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks?search=keyword
```

### PUT /tasks/:id

Updates `title` and/or `description` of an existing task.

```bash
curl -X PUT http://localhost:3000/tasks/:id \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated title", "description": "Updated description"}'
```

### DELETE /tasks/:id

Deletes a task by id.

```bash
curl -X DELETE http://localhost:3000/tasks/:id
```

### PATCH /tasks/:id/complete

Toggles the task completion status (`completed_at`).

```bash
curl -X PATCH http://localhost:3000/tasks/:id/complete
```

## CSV Import

Import tasks from a CSV file:

```bash
# Start the server first
npm start

# In another terminal
node import-csv.js
```

CSV format:

```csv
title,description
Task 01,Description of Task 01
Task 02,Description of Task 02
```

## Task Structure

| Field          | Description                          |
| -------------- | ------------------------------------ |
| `id`           | Unique identifier (UUID)             |
| `title`        | Task title                           |
| `description`  | Task description                     |
| `completed_at` | Completion date (`null` if pending)  |
| `created_at`   | Creation date                        |
| `updated_at`   | Last update date                     |
