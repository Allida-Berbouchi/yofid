
import express from "express";

import authMiddleware from "../middleware/auth.js";
import { requireCreatorOrAdmin } from "../middleware/resourceAccess.js";
import CourseController from "../controllers/Course.js";
import Course from "../models/Course.js";
import { error } from "console";

const router = express.Router();

router.get("/list", CourseController.listAllCourses);


router.post("/creat", authMiddleware, requireCreatorOrAdmin, async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Course title is required" });
    }

    const course = await Course.create({
      title: title.trim(),
      description: description || "",
      icon: icon || null,
      createdBy: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Creator/admin
router.get("/mine", authMiddleware, requireCreatorOrAdmin, async (req, res) => {
  try {
    const userRole = req.user?.role || req.account?.role;

    const query =
      userRole === "admin"
        ? {}
        : { createdBy: req.user.id };

    const courses = await Course.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;