import {
  createBoardService,
  deleteBoardService,
  editBoardService,
  getBoardNamesByUser,
  getBoardsByUser,
} from "../services/board.js";
import {
  createColumnService,
  deleteColumnService,
  editColumnService,
  getColumnNamesByBoard,
  getColumnsByUser,
} from "../services/column.js";
import {
  createTaskService,
  deleteTaskService,
  editTaskService,
  forwardCardService,
  getTasksByUser,
} from "../services/task.js";

///GET

export const getWorkspaceData = async (req, res) => {
  const userId = req.user.id;

  const boards = await getBoardsByUser(userId);
  const columns = await getColumnsByUser(userId);
  const tasks = await getTasksByUser(userId);

  const isEmpty = boards.length === 0;

  res.json({
    boards,
    columns,
    tasks,
    isEmpty,
  });
};

/* ---------------------------------- BOARD --------------------------------- */

export const createBoard = async (req, res) => {
  const newBoard = await createBoardService(req.body, req.user.id);
  res.status(201).json({
    status: 201,
    message: "Board created successfully!",
    data: newBoard,
  });
};

export const editBoard = async (req, res) => {
  const boardId = req.params.boardId;
  const updatedBoard = await editBoardService(boardId, req.body, req.user.id);
  res.json({
    status: 200,
    message: "Board updated successfully!",
    data: updatedBoard,
  });
};

export const deleteBoard = async (req, res) => {
  const boardId = req.params.boardId;
  await deleteBoardService(boardId, req.user.id);
  res.json({
    status: 200,
    message: "Board deleted successfully!",
  });
};

/* --------------------------------- COLUMN --------------------------------- */

export const createColumn = async (req, res) => {
  const boardId = req.params.boardId;
  const newColumn = await createColumnService(req.body, req.user.id, boardId);
  res.status(201).json({
    status: 201,
    message: "Column created successfully!",
    data: newColumn,
  });
};

export const editColumn = async (req, res) => {
  const columnId = req.params.columnId;
  const updatedColumn = await editColumnService(
    columnId,
    req.body,
    req.user.id,
  );
  res.json({
    status: 200,
    message: "Column updated successfully!",
    data: updatedColumn,
  });
};

export const deleteColumn = async (req, res) => {
  const columnId = req.params.columnId;
  await deleteColumnService(columnId, req.user.id);
  res.json({
    status: 200,
    message: "Column deleted successfully!",
  });
};

/* ---------------------------------- TASK ---------------------------------- */

export const createTask = async (req, res) => {
  const columnId = req.params.columnId;
  const boardId = req.params.boardId;
  const newTask = await createTaskService(
    req.body,
    req.user.id,
    columnId,
    boardId,
  );
  res.status(201).json({
    status: 201,
    message: "Task created successfully!",
    data: newTask,
  });
};

export const editTask = async (req, res) => {
  const taskId = req.params.taskId;
  const updatedTask = await editTaskService(taskId, req.body, req.user.id);
  res.json({
    status: 200,
    message: "Task updated successfully!",
    data: updatedTask,
  });
};

export const forwardCardController = async (req, res) => {
  const taskId = req.params.taskId;
  const updatedTask = await forwardCardService(taskId, req.body, req.user.id);
  res.json({
    status: 200,
    message: "Task updated successfully!",
    data: updatedTask,
  });
};

export const deleteTask = async (req, res) => {
  const taskId = req.params.taskId;
  await deleteTaskService(taskId, req.user.id);
  res.json({
    status: 200,
    message: "Task deleted successfully!",
  });
};
