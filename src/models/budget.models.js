import mongoose, { Schema } from "mongoose";

const budgetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      min: [0, "Budget cannot be negative"],
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
  },
  { timestamps: true },
);

// One budget per user+category+month+year
budgetSchema.index(
  { userId: 1, categoryId: 1, month: 1, year: 1 },
  { unique: true },
);

budgetSchema.index({ userId: 1, month: 1, year: 1 });

export const Budget = mongoose.model("Budget", budgetSchema);
