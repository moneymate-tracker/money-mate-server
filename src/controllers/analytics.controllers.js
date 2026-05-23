import mongoose from "mongoose";
import { Transaction } from "../models/transaction.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getMonthlySummary = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    throw new ApiError(400, "month and year query parameters are required");
  }

  const parsedMonth = parseInt(month);
  const parsedYear = parseInt(year);
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const [totals, categoryBreakdown] = await Promise.all([
    // Total expense and income for the month
    Transaction.aggregate([
      {
        $match: {
          userId,
          month: parsedMonth,
          year: parsedYear,
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),

    // Category breakdown for expenses
    Transaction.aggregate([
      {
        $match: {
          userId,
          type: "expense",
          month: parsedMonth,
          year: parsedYear,
        },
      },
      {
        $group: {
          _id: "$categoryId",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmpty: false } },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          name: "$category.name",
          icon: "$category.icon",
          color: "$category.color",
          bg: "$category.bg",
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]),
  ]);

  const totalExpense = totals.find((t) => t._id === "expense")?.total || 0;
  const totalIncome = totals.find((t) => t._id === "income")?.total || 0;
  const netSavings = totalIncome - totalExpense;

  // Add percentage to each category
  const breakdown = categoryBreakdown.map((c) => ({
    ...c,
    percentage: totalExpense > 0 ? parseFloat(((c.total / totalExpense) * 100).toFixed(2)) : 0,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      { totalExpense, totalIncome, netSavings, categoryBreakdown: breakdown },
      "Monthly summary fetched successfully",
    ),
  );
});

const getMonthlyTrend = asyncHandler(async (req, res) => {
  const months = Math.min(12, Math.max(1, parseInt(req.query.months) || 6));

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Build the list of last N months (oldest → newest)
  const monthList = [];
  for (let i = months - 1; i >= 0; i--) {
    let m = currentMonth - i;
    let y = currentYear;
    if (m <= 0) {
      m += 12;
      y -= 1;
    }
    monthList.push({ month: m, year: y });
  }

  const startEntry = monthList[0];
  const startDate = new Date(startEntry.year, startEntry.month - 1, 1);

  const userId = new mongoose.Types.ObjectId(req.user._id);

  const results = await Transaction.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { year: "$year", month: "$month", type: "$type" },
        total: { $sum: "$amount" },
      },
    },
  ]);

  // Build lookup: "YYYY-MM-type" → total
  const lookup = {};
  for (const r of results) {
    const key = `${r._id.year}-${r._id.month}-${r._id.type}`;
    lookup[key] = r.total;
  }

  const MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const trend = monthList.map(({ month, year }) => ({
    month,
    year,
    label: `${MONTH_LABELS[month - 1]} ${year}`,
    spent: lookup[`${year}-${month}-expense`] || 0,
    income: lookup[`${year}-${month}-income`] || 0,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, { trend }, "Monthly trend fetched successfully"));
});

const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const { month, year, type = "expense" } = req.query;

  if (!month || !year) {
    throw new ApiError(400, "month and year query parameters are required");
  }

  if (!["expense", "income"].includes(type)) {
    throw new ApiError(400, "type must be 'expense' or 'income'");
  }

  const userId = new mongoose.Types.ObjectId(req.user._id);

  const breakdown = await Transaction.aggregate([
    {
      $match: {
        userId,
        type,
        month: parseInt(month),
        year: parseInt(year),
      },
    },
    {
      $group: {
        _id: "$categoryId",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmpty: false } },
    {
      $project: {
        _id: 0,
        categoryId: "$_id",
        name: "$category.name",
        icon: "$category.icon",
        color: "$category.color",
        bg: "$category.bg",
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = breakdown.reduce((sum, c) => sum + c.total, 0);
  const result = breakdown.map((c) => ({
    ...c,
    percentage: grandTotal > 0 ? parseFloat(((c.total / grandTotal) * 100).toFixed(2)) : 0,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, { breakdown: result }, "Category breakdown fetched successfully"));
});

export { getMonthlySummary, getMonthlyTrend, getCategoryBreakdown };
