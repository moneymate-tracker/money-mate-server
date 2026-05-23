/**
 * Seed script — inserts dummy data from the client's dummyData.js into MongoDB.
 *
 * Run once:  node src/utils/seed-dummy-data.js
 *
 * Creates:
 *   - A demo user  (email: demo@moneymate.com / password: Demo@1234)
 *   - 24 expense transactions
 *   - 5  income  transactions
 *   - 10 budgets
 *
 * Safe to re-run — skips insertion if demo user already has transactions.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

dotenv.config({ path: "./.env" });

// ── inline models (avoid circular import issues when running standalone) ──────

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, trim: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: true },
    refreshToken: String,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    phone: { type: String, default: null },
    currency: { type: String, default: "USD" },
    avatar: {
      type: { url: String, localPath: String },
      default: { url: "https://placehold.co/200x200", localPath: "" },
    },
  },
  { timestamps: true },
);

const categorySchema = new mongoose.Schema({
  name: String,
  icon: String,
  color: String,
  bg: String,
  isSystem: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, default: null },
});

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["expense", "income"] },
    categoryId: { type: mongoose.Schema.Types.ObjectId },
    amount: Number,
    description: { type: String, default: "" },
    date: Date,
    month: Number,
    year: Number,
  },
  { timestamps: true },
);

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId },
    budget: Number,
    month: Number,
    year: Number,
  },
  { timestamps: true },
);

budgetSchema.index({ userId: 1, categoryId: 1, month: 1, year: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);

// ── dummy data (mirrored from client/data/dummyData.js) ──────────────────────

const DUMMY_CATEGORIES = [
  { dummyId: "c1", name: "Food & Dining" },
  { dummyId: "c2", name: "Transport" },
  { dummyId: "c3", name: "Shopping" },
  { dummyId: "c4", name: "Entertainment" },
  { dummyId: "c5", name: "Health" },
  { dummyId: "c6", name: "Bills & Utilities" },
  { dummyId: "c7", name: "Education" },
  { dummyId: "c8", name: "Others" },
  { dummyId: "income", name: "Income" },
];

const DUMMY_EXPENSES = [
  { id: "e1",  categoryId: "c1", amount: 45.50,  description: "Lunch at Chipotle",      date: "2024-04-18", month: 4, year: 2024 },
  { id: "e2",  categoryId: "c2", amount: 22.00,  description: "Uber to airport",         date: "2024-04-17", month: 4, year: 2024 },
  { id: "e3",  categoryId: "c3", amount: 120.00, description: "Nike shoes",              date: "2024-04-16", month: 4, year: 2024 },
  { id: "e4",  categoryId: "c4", amount: 15.99,  description: "Netflix subscription",    date: "2024-04-15", month: 4, year: 2024 },
  { id: "e5",  categoryId: "c5", amount: 35.00,  description: "Pharmacy",                date: "2024-04-14", month: 4, year: 2024 },
  { id: "e6",  categoryId: "c6", amount: 80.00,  description: "Electricity bill",        date: "2024-04-13", month: 4, year: 2024 },
  { id: "e7",  categoryId: "c1", amount: 32.00,  description: "Grocery shopping",        date: "2024-04-12", month: 4, year: 2024 },
  { id: "e8",  categoryId: "c7", amount: 60.00,  description: "Udemy course",            date: "2024-04-11", month: 4, year: 2024 },
  { id: "e9",  categoryId: "c3", amount: 55.00,  description: "Amazon order",            date: "2024-04-10", month: 4, year: 2024 },
  { id: "e10", categoryId: "c2", amount: 12.50,  description: "Metro pass",              date: "2024-04-09", month: 4, year: 2024 },
  { id: "e11", categoryId: "c1", amount: 28.75,  description: "Dinner with friends",     date: "2024-03-30", month: 3, year: 2024 },
  { id: "e12", categoryId: "c4", amount: 25.00,  description: "Cinema tickets",          date: "2024-03-28", month: 3, year: 2024 },
  { id: "e13", categoryId: "c5", amount: 90.00,  description: "Gym membership",          date: "2024-03-25", month: 3, year: 2024 },
  { id: "e14", categoryId: "c6", amount: 75.00,  description: "Internet bill",           date: "2024-03-22", month: 3, year: 2024 },
  { id: "e15", categoryId: "c3", amount: 200.00, description: "H&M clothing",            date: "2024-03-20", month: 3, year: 2024 },
  { id: "e16", categoryId: "c1", amount: 18.50,  description: "Coffee & work snacks",    date: "2024-03-18", month: 3, year: 2024 },
  { id: "e17", categoryId: "c2", amount: 35.00,  description: "Gas refill",              date: "2024-03-15", month: 3, year: 2024 },
  { id: "e18", categoryId: "c8", amount: 50.00,  description: "Birthday gift",           date: "2024-03-12", month: 3, year: 2024 },
  { id: "e19", categoryId: "c7", amount: 30.00,  description: "Books",                   date: "2024-02-28", month: 2, year: 2024 },
  { id: "e20", categoryId: "c1", amount: 65.00,  description: "Meal prep groceries",     date: "2024-02-25", month: 2, year: 2024 },
  { id: "e21", categoryId: "c4", amount: 12.99,  description: "Spotify subscription",    date: "2024-02-20", month: 2, year: 2024 },
  { id: "e22", categoryId: "c5", amount: 45.00,  description: "Doctor visit",            date: "2024-02-18", month: 2, year: 2024 },
  { id: "e23", categoryId: "c6", amount: 90.00,  description: "Water + electricity",     date: "2024-02-15", month: 2, year: 2024 },
  { id: "e24", categoryId: "c2", amount: 20.00,  description: "Taxi fare",               date: "2024-02-10", month: 2, year: 2024 },
];

const DUMMY_INCOME = [
  { id: "i1", amount: 3500, description: "Salary",       month: 4, year: 2024, date: "2024-04-01" },
  { id: "i2", amount: 500,  description: "Freelance",    month: 4, year: 2024, date: "2024-04-05" },
  { id: "i3", amount: 3500, description: "Salary",       month: 3, year: 2024, date: "2024-03-01" },
  { id: "i4", amount: 300,  description: "Side project", month: 3, year: 2024, date: "2024-03-10" },
  { id: "i5", amount: 3500, description: "Salary",       month: 2, year: 2024, date: "2024-02-01" },
];

const DUMMY_BUDGETS = [
  { id: "b1",  categoryId: "c1", budget: 300, month: 4, year: 2024 },
  { id: "b2",  categoryId: "c2", budget: 150, month: 4, year: 2024 },
  { id: "b3",  categoryId: "c3", budget: 200, month: 4, year: 2024 },
  { id: "b4",  categoryId: "c4", budget: 100, month: 4, year: 2024 },
  { id: "b5",  categoryId: "c5", budget: 100, month: 4, year: 2024 },
  { id: "b6",  categoryId: "c6", budget: 150, month: 4, year: 2024 },
  { id: "b7",  categoryId: "c7", budget: 80,  month: 4, year: 2024 },
  { id: "b8",  categoryId: "c3", budget: 250, month: 3, year: 2024 },
  { id: "b9",  categoryId: "c1", budget: 280, month: 3, year: 2024 },
  { id: "b10", categoryId: "c5", budget: 80,  month: 3, year: 2024 },
];

// ── seed function ─────────────────────────────────────────────────────────────

async function seedDummyData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  // ── 1. Ensure system categories exist ────────────────────────────────────
  // First seed system categories if needed (reuse logic from seed-categories.js)
  const SYSTEM_CATEGORIES = [
    { name: "Food & Dining",    icon: "fast-food-outline",          color: "#FF6B6B", bg: "#FFE8E8", isSystem: true },
    { name: "Transport",        icon: "car-outline",                color: "#4ECDC4", bg: "#E8FAF9", isSystem: true },
    { name: "Housing",          icon: "home-outline",               color: "#45B7D1", bg: "#E6F7FC", isSystem: true },
    { name: "Entertainment",    icon: "game-controller-outline",    color: "#96CEB4", bg: "#EEF7F2", isSystem: true },
    { name: "Health",           icon: "medkit-outline",             color: "#FF8B94", bg: "#FFE8EA", isSystem: true },
    { name: "Education",        icon: "school-outline",             color: "#A8E6CF", bg: "#EEF9F4", isSystem: true },
    { name: "Shopping",         icon: "bag-handle-outline",         color: "#FFD93D", bg: "#FFFAE6", isSystem: true },
    { name: "Bills & Utilities",icon: "receipt-outline",            color: "#6C63FF", bg: "#EDECFF", isSystem: true },
    { name: "Savings",          icon: "wallet-outline",             color: "#26de81", bg: "#E6FAF0", isSystem: true },
    { name: "Income",           icon: "cash-outline",               color: "#20BF6B", bg: "#E6F8EF", isSystem: true },
    { name: "Investments",      icon: "trending-up-outline",        color: "#F7B731", bg: "#FEF9E7", isSystem: true },
    { name: "Others",           icon: "ellipsis-horizontal-outline",color: "#A0AEC0", bg: "#F1F3F5", isSystem: true },
  ];
  try {
    await Category.insertMany(SYSTEM_CATEGORIES, { ordered: false });
    console.log("✅ System categories seeded");
  } catch (e) {
    if (e.code === 11000 || e.name === "MongoBulkWriteError") {
      console.log("ℹ️  System categories already exist");
    } else throw e;
  }

  // ── 2. Build dummyId → MongoDB ObjectId map ───────────────────────────────
  const categoryDocs = await Category.find({ isSystem: true });
  const nameToId = {};
  for (const doc of categoryDocs) {
    nameToId[doc.name] = doc._id;
  }

  const catMap = {};
  for (const { dummyId, name } of DUMMY_CATEGORIES) {
    if (!nameToId[name]) {
      console.warn(`⚠️  System category not found: "${name}" — skipping`);
      continue;
    }
    catMap[dummyId] = nameToId[name];
  }

  // ── 3. Find or create demo user ───────────────────────────────────────────
  const DEMO_EMAIL = "demo@moneymate.com";
  let demoUser = await User.findOne({ email: DEMO_EMAIL });

  if (!demoUser) {
    const hashedPassword = await bcrypt.hash("Demo@1234", 10);
    demoUser = await User.create({
      username: "alexjohnson",
      email: DEMO_EMAIL,
      fullName: "Alex Johnson",
      password: hashedPassword,
      isEmailVerified: true,
      currency: "USD",
    });
    console.log("✅ Demo user created  →  demo@moneymate.com / Demo@1234");
  } else {
    console.log("ℹ️  Demo user already exists");
  }

  // ── 4. Skip if data already seeded ───────────────────────────────────────
  const existingCount = await Transaction.countDocuments({ userId: demoUser._id });
  if (existingCount > 0) {
    console.log(`ℹ️  Demo user already has ${existingCount} transactions — skipping`);
    await mongoose.disconnect();
    return;
  }

  // ── 5. Insert expense transactions ───────────────────────────────────────
  const expenseDocs = DUMMY_EXPENSES
    .filter((e) => catMap[e.categoryId])
    .map((e) => ({
      userId: demoUser._id,
      type: "expense",
      categoryId: catMap[e.categoryId],
      amount: e.amount,
      description: e.description,
      date: new Date(e.date),
      month: e.month,
      year: e.year,
    }));

  await Transaction.insertMany(expenseDocs);
  console.log(`✅ Inserted ${expenseDocs.length} expense transactions`);

  // ── 6. Insert income transactions ─────────────────────────────────────────
  const incomeCatId = catMap["income"];
  if (!incomeCatId) {
    console.warn("⚠️  Income category not found — skipping income records");
  } else {
    const incomeDocs = DUMMY_INCOME.map((i) => ({
      userId: demoUser._id,
      type: "income",
      categoryId: incomeCatId,
      amount: i.amount,
      description: i.description,
      date: new Date(i.date),
      month: i.month,
      year: i.year,
    }));

    await Transaction.insertMany(incomeDocs);
    console.log(`✅ Inserted ${incomeDocs.length} income transactions`);
  }

  // ── 7. Insert budgets ─────────────────────────────────────────────────────
  const budgetDocs = DUMMY_BUDGETS
    .filter((b) => catMap[b.categoryId])
    .map((b) => ({
      userId: demoUser._id,
      categoryId: catMap[b.categoryId],
      budget: b.budget,
      month: b.month,
      year: b.year,
    }));

  try {
    await Budget.insertMany(budgetDocs, { ordered: false });
    console.log(`✅ Inserted ${budgetDocs.length} budgets`);
  } catch (e) {
    if (e.code === 11000 || e.name === "MongoBulkWriteError") {
      console.log("ℹ️  Some budgets already exist, inserted non-duplicates");
    } else throw e;
  }

  console.log("\n🎉 Dummy data seed complete!");
  console.log("   Login: demo@moneymate.com");
  console.log("   Password: Demo@1234");

  await mongoose.disconnect();
}

seedDummyData().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
