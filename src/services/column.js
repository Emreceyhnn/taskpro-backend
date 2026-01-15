import createHttpError from "http-errors";
import { Column } from "../db/models/columns.js";
import { Task } from "../db/models/tasks.js";
import { Board } from "../db/models/boards.js";

export const getColumnsByUser = async (userId) => {
  const columns = await Column.find({ userId }).sort({ order: 1 });

  // if (columns.length === 0) {
  //   throw createHttpError(404, "No columns found for this board");
  // }

  return columns;
};

export const createColumnService = async (columnData, userId, boardId) => {
  const { name } = columnData;

  const board = await Board.findOne({ _id: boardId, userId });
  if (!board) {
    throw createHttpError(404, "Board not found");
  }

  const existingColumn = await Column.findOne({ boardId, name });
  if (existingColumn) {
    throw createHttpError(
      409,
      "Column with the same name already exists in this board"
    );
  }
  const lastColumn = await Column.findOne({ boardId }).sort({ order: -1 });

  const order = lastColumn ? lastColumn.order + 1 : 1;

  return await Column.create({
    boardId,
    name,
    order,
  });
};

export const editColumnService = async (columnId, columnData, userId) => {
  const { name, order } = columnData;

  const column = await Column.findById(columnId);
  if (!column) {
    throw createHttpError(404, "Column not found");
  }

  const board = await Board.findOne({
    _id: column.boardId,
    userId,
  });

  if (!board) {
    throw createHttpError(403, "Access denied");
  }

  if (name) {
    const duplicate = await Column.findOne({
      _id: { $ne: columnId },
      boardId: column.boardId,
      name,
    });

    if (duplicate) {
      throw createHttpError(409, "Column with the same name already exists");
    }
  }

  column.name = name ?? column.name;
  column.order = order ?? column.order;

  await column.save();
  return column;
};

export const deleteColumnService = async (columnId, userId) => {
  const column = await Column.findById(columnId);
  if (!column) {
    throw createHttpError(404, "Column not found");
  }

  const board = await Board.findOne({
    _id: column.boardId,
    userId,
  });

  if (!board) {
    throw createHttpError(403, "Access denied");
  }

  await Task.deleteMany({ columnId });
  await column.deleteOne();
};

export const getColumnNamesByBoard = async (boardId, userId) => {
  const board = await Board.findOne({ _id: boardId, userId });
  if (!board) {
    throw createHttpError(404, "Board not found");
  }
  const columns = await Column.find({ boardId }).select("name order").lean();
  return columns;
};
