import fs from "fs";

import Courses from "../models/Course.js";
import Content from "../models/Content.js";

const calculateCourseAvgTime = async (courseId) => {
  try {
    const videos = await Content.find({
      courseId: courseId,
      type: "video",
      status: "approved",
    });

    const totalDuration = videos.reduce((sum, video) => sum + (video.duration || 0), 0);
    return totalDuration;
  } catch (err) {
    console.error(`Error calculating avg time for course ${courseId}:`, err);
    return 0;
  }
};

const listAllCourses = async (req, res) => {
  try {
    const courses = await Courses.find().populate("createdBy", "name email");

    const coursesWithTime = await Promise.all(
      courses.map(async (course) => {
        const avgTime = await calculateCourseAvgTime(course._id);
        return {
          ...course.toObject(),
          avgTime: avgTime,
        };
      })
    );

    res.json(coursesWithTime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { listAllCourses };
