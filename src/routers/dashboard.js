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
  getBoardNames,
  getColumnNames,
  getWorkspaceData,
} from "../controllers/dashboard.js";
import {
  createBoardSchema,
  createColumnSchema,
  createTaskSchema,
  editBoardSchema,
  editColumnSchema,
  editTaskSchema,
} from "../validation/dashboard.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

const router = Router();

router.use(authMiddleware);

router.get("/:userId", ctrlWrapper(getWorkspaceData));

router.get("/:userId/boards", ctrlWrapper(getBoardNames));

router.get("/:userId/boards/:boardId/columns", ctrlWrapper(getColumnNames));

/* ---------------------------------- BOARD --------------------------------- */

router.post(
  "/:userId/boards",
  validateBody(createBoardSchema),
  ctrlWrapper(createBoard)
);

router.patch(
  "/:userId/boards/:boardId",
  validateBody(editBoardSchema),
  ctrlWrapper(editBoard)
);

router.delete("/:userId/boards/:boardId", ctrlWrapper(deleteBoard));

/* --------------------------------- COLUMN --------------------------------- */

router.post(
  "/:userId/boards/:boardId/columns",
  validateBody(createColumnSchema),
  ctrlWrapper(createColumn)
);

router.patch(
  "/:userId/columns/:columnId",
  validateBody(editColumnSchema),
  ctrlWrapper(editColumn)
);

router.delete("/:userId/columns/:columnId", ctrlWrapper(deleteColumn));

/* ---------------------------------- TASK ---------------------------------- */

router.post(
  "/:userId/boards/:boardId/columns/:columnId/tasks",
  validateBody(createTaskSchema),
  ctrlWrapper(createTask)
);

router.patch(
  "/:userId/tasks/:taskId",
  validateBody(editTaskSchema),
  ctrlWrapper(editTask)
);

router.delete("/:userId/tasks/:taskId", ctrlWrapper(deleteTask));

export default router;
