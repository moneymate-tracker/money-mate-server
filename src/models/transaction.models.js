import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than 0"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
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

transactionSchema.index({ userId: 1, month: 1, year: 1 });
transactionSchema.index({ userId: 1, type: 1, month: 1, year: 1 });
transactionSchema.index({ userId: 1, categoryId: 1, month: 1, year: 1 });
transactionSchema.index({ userId: 1, date: -1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);
