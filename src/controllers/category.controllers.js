import mongoose from "mongoose";
import { Category } from "../models/category.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getCategories = asyncHandler(async (req, res) => {
  const filter = { $or: [{ isSystem: true }] };

  // If authenticated, also return user's custom categories
  if (req.user) {
    filter.$or.push({ userId: req.user._id, isSystem: false });
  }

  const categories = await Category.find(filter).sort({ isSystem: -1, name: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { categories }, "Categories fetched successfully"));
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, color, bg } = req.body;

  const category = await Category.create({
    name,
    icon,
    color,
    bg,
    isSystem: false,
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { category }, "Category created successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(422, "Invalid category ID");
  }

  const category = await Category.findOne({
    _id: categoryId,
    userId: req.user._id,
    isSystem: false,
  });

  if (!category) {
    throw new ApiError(403, "Cannot modify this category");
  }

  const { name, icon, color, bg } = req.body;
  if (name !== undefined) category.name = name;
  if (icon !== undefined) category.icon = icon;
  if (color !== undefined) category.color = color;
  if (bg !== undefined) category.bg = bg;

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { category }, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(422, "Invalid category ID");
  }

  const category = await Category.findOne({
    _id: categoryId,
    userId: req.user._id,
    isSystem: false,
  });

  if (!category) {
    throw new ApiError(403, "Cannot delete this category");
  }

  await category.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export { getCategories, createCategory, updateCategory, deleteCategory };
