import { Category } from "../models/category.models.js";

const SYSTEM_CATEGORIES = [
  { name: "Food & Dining", icon: "fast-food-outline", color: "#FF6B6B", bg: "#FFE8E8", isSystem: true },
  { name: "Transport", icon: "car-outline", color: "#4ECDC4", bg: "#E8FAF9", isSystem: true },
  { name: "Housing", icon: "home-outline", color: "#45B7D1", bg: "#E6F7FC", isSystem: true },
  { name: "Entertainment", icon: "game-controller-outline", color: "#96CEB4", bg: "#EEF7F2", isSystem: true },
  { name: "Health", icon: "medkit-outline", color: "#FF8B94", bg: "#FFE8EA", isSystem: true },
  { name: "Education", icon: "school-outline", color: "#A8E6CF", bg: "#EEF9F4", isSystem: true },
  { name: "Shopping", icon: "bag-handle-outline", color: "#FFD93D", bg: "#FFFAE6", isSystem: true },
  { name: "Bills & Utilities", icon: "receipt-outline", color: "#6C63FF", bg: "#EDECFF", isSystem: true },
  { name: "Savings", icon: "wallet-outline", color: "#26de81", bg: "#E6FAF0", isSystem: true },
  { name: "Income", icon: "cash-outline", color: "#20BF6B", bg: "#E6F8EF", isSystem: true },
  { name: "Investments", icon: "trending-up-outline", color: "#F7B731", bg: "#FEF9E7", isSystem: true },
  { name: "Others", icon: "ellipsis-horizontal-outline", color: "#A0AEC0", bg: "#F1F3F5", isSystem: true },
];

const seedSystemCategories = async () => {
  try {
    await Category.insertMany(SYSTEM_CATEGORIES, { ordered: false });
    console.log("✅ System categories seeded");
  } catch (error) {
    // code 11000 = duplicate key — categories already seeded, safe to ignore
    if (error.code === 11000 || error.name === "MongoBulkWriteError") {
      console.log("ℹ️  System categories already exist, skipping seed");
    } else {
      console.error("❌ Category seed error:", error.message);
    }
  }
};

export { seedSystemCategories };
