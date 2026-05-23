import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Profile fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, currency } = req.body;

  const updateFields = {};
  if (fullName !== undefined) updateFields.fullName = fullName;
  if (phone !== undefined) updateFields.phone = phone;
  if (currency !== undefined) updateFields.currency = currency.toUpperCase();

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true },
  ).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Profile updated successfully"));
});

export { getProfile, updateProfile };
