import { randomUUID } from "node:crypto";
import { Database } from "./db.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      if (!req.body) {
        return res.writeHead(400).end(
          JSON.stringify({ message: "Request body is required." })
        );
      }

      const { title, description } = req.body;

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({ message: "Title is required." })
        );
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: "Description is required." })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end(JSON.stringify(task));
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search ? { title: search, description: search } : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      if (!req.body) {
        return res.writeHead(400).end(
          JSON.stringify({ message: "Request body is required." })
        );
      }

      const { title, description } = req.body;

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Title or description is required.",
          })
        );
      }

      const existingTask = database.findById("tasks", id);

      if (!existingTask) {
        return res.writeHead(404).end(
          JSON.stringify({ message: "Task not found." })
        );
      }

      const dataToUpdate = {
        title: title ?? existingTask.title,
        description: description ?? existingTask.description,
        updated_at: new Date().toISOString(),
      };

      database.update("tasks", id, dataToUpdate);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const existingTask = database.findById("tasks", id);

      if (!existingTask) {
        return res.writeHead(404).end(
          JSON.stringify({ message: "Task not found." })
        );
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const existingTask = database.findById("tasks", id);

      if (!existingTask) {
        return res.writeHead(404).end(
          JSON.stringify({ message: "Task not found." })
        );
      }

      const isCompleted = !!existingTask.completed_at;

      database.update("tasks", id, {
        completed_at: isCompleted ? null : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      return res.writeHead(204).end();
    },
  },
];
