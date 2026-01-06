import createHttpError from "http-errors";
import { Board } from "../db/models/boards.js";
import { Column } from "../db/models/columns.js";
import { Task } from "../db/models/tasks.js";

export const getBoardsByUser = async (userId) => {
  const boards = await Board.find({ userId }).sort({ createdAt: -1 });

  if (boards.length === 0) {
    throw createHttpError(404, "No boards found for this user");
  }

  return boards;
};

export const createBoardService = async (boardData, userId) => {
  const { title, icon, background } = boardData;

  console.log("Creating board with title:", title, "for user:", userId);
  const exists = await Board.findOne({ title, userId });
  if (exists) {
    throw createHttpError(409, "Board with the same title already exists");
  }

  return await Board.create({
    title,
    userId,
    icon,
    background,
  });
};

export const editBoardService = async (boardId, boardData, userId) => {
  const { title, icon, background } = boardData;

  if (title) {
    const duplicate = await Board.findOne({
      _id: { $ne: boardId },
      title,
      userId,
    });

    if (duplicate) {
      throw createHttpError(409, "Board title already exists");
    }
  }

  const board = await Board.findOneAndUpdate(
    { _id: boardId, userId },
    { title, icon, background },
    { new: true }
  );

  if (!board) {
    throw createHttpError(404, "Board not found");
  }

  return board;
};

export const deleteBoardService = async (boardId, userId) => {
  const board = await Board.findOne({ _id: boardId, userId });
  if (!board) {
    throw createHttpError(404, "Board not found");
  }

  await Column.deleteMany({ boardId });
  await Task.deleteMany({ boardId });
  await board.deleteOne();
};

export const getBoardNamesByUser = async (userId) => {
  const boards = await Board.find({ userId }).select("title").lean();

  if (boards.length === 0) {
    throw createHttpError(404, "No boards found for this user");
  }

  return boards;
};
