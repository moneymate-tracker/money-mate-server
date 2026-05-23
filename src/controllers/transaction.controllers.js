import mongoose from "mongoose";
import { Transaction } from "../models/transaction.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getTransactions = asyncHandler(async (req, res) => {
  const {
    type,
    month,
    year,
    categoryId,
    search,
    page = 1,
    limit = 20,
  } = req.query;

  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

  const filter = { userId: req.user._id };

  if (type && ["expense", "income"].includes(type)) filter.type = type;
  if (month) filter.month = parseInt(month);
  if (year) filter.year = parseInt(year);
  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    filter.categoryId = categoryId;
  }
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.description = { $regex: escaped, $options: "i" };
  }

  const skip = (parsedPage - 1) * parsedLimit;

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate("categoryId", "name icon color bg")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit),
    Transaction.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        transactions,
        total,
        page: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
      },
      "Transactions fetched successfully",
    ),
  );
});

const createTransaction = asyncHandler(async (req, res) => {
  const { type, categoryId, amount, description, date, month, year } = req.body;

  const transaction = await Transaction.create({
    userId: req.user._id,
    type,
    categoryId,
    amount: parseFloat(amount),
    description: description || "",
    date: new Date(date),
    month: parseInt(month),
    year: parseInt(year),
  });

  await transaction.populate("categoryId", "name icon color bg");

  return res
    .status(201)
    .json(new ApiResponse(201, { transaction }, "Transaction created successfully"));
});

const getTransactionById = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new ApiError(422, "Invalid transaction ID");
  }

  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId: req.user._id,
  }).populate("categoryId", "name icon color bg");

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { transaction }, "Transaction fetched successfully"));
});

const updateTransaction = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new ApiError(422, "Invalid transaction ID");
  }

  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId: req.user._id,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  const { categoryId, amount, description, date, month, year } = req.body;

  if (categoryId !== undefined) transaction.categoryId = categoryId;
  if (amount !== undefined) transaction.amount = parseFloat(amount);
  if (description !== undefined) transaction.description = description;
  if (date !== undefined) transaction.date = new Date(date);
  if (month !== undefined) transaction.month = parseInt(month);
  if (year !== undefined) transaction.year = parseInt(year);

  await transaction.save();
  await transaction.populate("categoryId", "name icon color bg");

  return res
    .status(200)
    .json(new ApiResponse(200, { transaction }, "Transaction updated successfully"));
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new ApiError(422, "Invalid transaction ID");
  }

  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId: req.user._id,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  await transaction.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Transaction deleted successfully"));
});

export {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
