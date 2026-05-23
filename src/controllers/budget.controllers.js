import mongoose from "mongoose";
import { Budget } from "../models/budget.models.js";
import { Transaction } from "../models/transaction.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getBudgets = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    throw new ApiError(400, "month and year query parameters are required");
  }

  const parsedMonth = parseInt(month);
  const parsedYear = parseInt(year);

  const [budgets, spentResults] = await Promise.all([
    Budget.find({
      userId: req.user._id,
      month: parsedMonth,
      year: parsedYear,
    }).populate("categoryId", "name icon color bg"),

    Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          type: "expense",
          month: parsedMonth,
          year: parsedYear,
        },
      },
      {
        $group: {
          _id: "$categoryId",
          spent: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  // Build a map of categoryId → spent amount
  const spentMap = {};
  for (const s of spentResults) {
    spentMap[s._id.toString()] = s.spent;
  }

  const enrichedBudgets = budgets.map((b) => ({
    ...b.toObject(),
    spent: spentMap[b.categoryId._id.toString()] || 0,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, { budgets: enrichedBudgets }, "Budgets fetched successfully"));
});

const createBudget = asyncHandler(async (req, res) => {
  const { categoryId, budget, month, year } = req.body;

  try {
    const newBudget = await Budget.create({
      userId: req.user._id,
      categoryId,
      budget: parseFloat(budget),
      month: parseInt(month),
      year: parseInt(year),
    });

    await newBudget.populate("categoryId", "name icon color bg");

    return res
      .status(201)
      .json(new ApiResponse(201, { budget: newBudget }, "Budget created successfully"));
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        409,
        "A budget for this category/month/year already exists. Use PATCH to update it.",
      );
    }
    throw error;
  }
});

const updateBudget = asyncHandler(async (req, res) => {
  const { budgetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(budgetId)) {
    throw new ApiError(422, "Invalid budget ID");
  }

  const budgetDoc = await Budget.findOne({
    _id: budgetId,
    userId: req.user._id,
  });

  if (!budgetDoc) {
    throw new ApiError(404, "Budget not found");
  }

  budgetDoc.budget = parseFloat(req.body.budget);
  await budgetDoc.save();
  await budgetDoc.populate("categoryId", "name icon color bg");

  return res
    .status(200)
    .json(new ApiResponse(200, { budget: budgetDoc }, "Budget updated successfully"));
});

const deleteBudget = asyncHandler(async (req, res) => {
  const { budgetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(budgetId)) {
    throw new ApiError(422, "Invalid budget ID");
  }

  const budgetDoc = await Budget.findOne({
    _id: budgetId,
    userId: req.user._id,
  });

  if (!budgetDoc) {
    throw new ApiError(404, "Budget not found");
  }

  await budgetDoc.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Budget deleted successfully"));
});

export { getBudgets, createBudget, updateBudget, deleteBudget };
