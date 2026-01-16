import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  createColumn,
  createTask,
  deleteColumn,
  deleteTask,
  editColumn,
  editTask,
  createBoard,
  deleteBoard,
  editBoard,
  getWorkspaceData,
  forwardCardController,
} from "../controllers/dashboard.js";
import {
  createBoardSchema,
  createColumnSchema,
  createTaskSchema,
  editBoardSchema,
  editColumnSchema,
  editTaskSchema,
  forwardCard,
} from "../validation/dashboard.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

const router = Router();

router.use(authMiddleware);

router.get("/", ctrlWrapper(getWorkspaceData));

/* ---------------------------------- BOARD --------------------------------- */

router.post(
  "/boards",
  validateBody(createBoardSchema),
  ctrlWrapper(createBoard),
);

router.patch(
  "/boards/:boardId",
  validateBody(editBoardSchema),
  ctrlWrapper(editBoard),
);

router.delete("/boards/:boardId", ctrlWrapper(deleteBoard));

/* --------------------------------- COLUMN --------------------------------- */

router.post(
  "/boards/:boardId/columns",
  validateBody(createColumnSchema),
  ctrlWrapper(createColumn),
);

router.patch(
  "/columns/:columnId",
  validateBody(editColumnSchema),
  ctrlWrapper(editColumn),
);

router.delete("/columns/:columnId", ctrlWrapper(deleteColumn));

/* ---------------------------------- TASK ---------------------------------- */

router.post(
  "/boards/:boardId/columns/:columnId/tasks",
  validateBody(createTaskSchema),
  ctrlWrapper(createTask),
);

router.patch(
  "/tasks/:taskId",
  validateBody(editTaskSchema),
  ctrlWrapper(editTask),
);

router.patch(
  "/tasks/:taskId/forward",
  validateBody(forwardCard),
  ctrlWrapper(forwardCardController),
);

router.delete("/tasks/:taskId", ctrlWrapper(deleteTask));

export default router;
