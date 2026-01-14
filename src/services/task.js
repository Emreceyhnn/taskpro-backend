import createHttpError from "http-errors";
import { Board } from "../db/models/boards.js";
import { Column } from "../db/models/columns.js";
import { Task } from "../db/models/tasks.js";

export const getTasksByUser = async (boardId, columnId, userId) => {
  const tasks = await Task.find({ userId }).sort({ order: 1 });

  if (tasks.length === 0) {
    throw createHttpError(404, "No tasks found for this column");
  }

  return tasks;
};

export const createTaskService = async (
  taskData,
  userId,
  columnId,
  boardId
) => {
  const { title, description, priority, deadline } = taskData;

  const board = await Board.findOne({ _id: boardId, userId });
  if (!board) {
    throw createHttpError(404, "Board not found");
  }

  const column = await Column.findOne({ _id: columnId, boardId });
  if (!column) {
    throw createHttpError(404, "Column not found in this board");
  }

  const lastColumn = await Column.findOne({ boardId }).sort({ order: -1 });

  const order = lastColumn ? lastColumn.order + 1 : 1;

  const task = await Task.create({
    boardId,
    columnId,
    title,
    description,
    priority,
    deadline,
    order,
  });

  return task;
};

export const editTaskService = async (taskId, taskData, userId) => {
  const { title, description, priority, deadline, order } = taskData;

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      priority,
      deadline,
      order,
    },
    { new: true }
  );

  if (!updatedTask) {
    throw createHttpError(404, "Task not found");
  }

  return updatedTask;
};

export const forwardCardService = async (taskId, taskData) => {
  const { columnId } = taskData;

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { columnId },
    { new: true }
  );

  if (!updatedTask) {
    throw createHttpError(404, "Task not found");
  }

  return updatedTask;
};

export const deleteTaskService = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw createHttpError(404, "Task not found");
  }
  return;
};
