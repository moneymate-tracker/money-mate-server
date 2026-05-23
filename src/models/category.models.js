import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    bg: {
      type: String,
      required: true,
      trim: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

categorySchema.index({ userId: 1, isSystem: 1 });

// Prevent duplicate custom category names per user
categorySchema.index(
  { name: 1, userId: 1 },
  { unique: true, partialFilterExpression: { isSystem: false } },
);

export const Category = mongoose.model("Category", categorySchema);
