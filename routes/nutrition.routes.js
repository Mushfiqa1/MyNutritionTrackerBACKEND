import express from "express";
import {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} from "../controllers/nutrition.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a new nutrition entry
router.post("/", auth, createEntry);

// Get all entries for logged-in user
router.get("/", auth, getEntries);

// Update a specific entry
router.put("/:id", auth, updateEntry);

// Delete a specific entry
router.delete("/:id", auth, deleteEntry);

export default router;
