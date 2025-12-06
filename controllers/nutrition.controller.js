import NutritionEntry from "../models/nutritionEntry.model.js";

// @desc    Create a new nutrition entry
// @route   POST /api/nutrition
// @access  Private
export const createEntry = async (req, res) => {
  try {
    const { foodName, calories, protein, carbs, fats } = req.body;

    if (!foodName || !calories) {
      return res.status(400).json({ message: "Food name and calories are required" });
    }

    const newEntry = await NutritionEntry.create({
      user: req.user._id,
      foodName,
      calories,
      protein,
      carbs,
      fats,
    });

    return res.status(201).json(newEntry);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all entries for the logged-in user
// @route   GET /api/nutrition
// @access  Private
export const getEntries = async (req, res) => {
  try {
    const entries = await NutritionEntry.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json(entries);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update an entry
// @route   PUT /api/nutrition/:id
// @access  Private
export const updateEntry = async (req, res) => {
  try {
    const entry = await NutritionEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Ensure the entry belongs to the user
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await NutritionEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an entry
// @route   DELETE /api/nutrition/:id
// @access  Private
export const deleteEntry = async (req, res) => {
  try {
    const entry = await NutritionEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Ensure the entry belongs to the user
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await entry.deleteOne();

    return res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
