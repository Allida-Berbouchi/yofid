import express from "express";

import authMiddleware from "../middleware/auth.js";
import { requireCreatorOrAdmin } from "../middleware/resourceAccess.js";
import CourseRoutes from "../controllers/Course.js";
import Course from "../models/Course.js";

const router = express.Router();

router.post("/courses", authMiddleware, requireCreatorOrAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.create({
      title,
      description: description || "",
      createdBy: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/courses/mine", authMiddleware, requireCreatorOrAdmin, async (req, res) => {
  try {
    const query = req.account?.role === "admin"
      ? {}
      : { createdBy: req.user.id };

    const courses = await Course.find(query).sort({
      createdAt: -1,
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/courses/list",CourseRoutes.listAllCourses)

export default router;
