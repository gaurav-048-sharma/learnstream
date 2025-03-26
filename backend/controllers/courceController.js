const Course = require("../models/course.js");
const cloudinary = require('../config/cloudinary.js');


const uploadVideoToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'learnstream/videos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url); // Return the HLS URL
        }
      );
      stream.end(file.buffer);
    });
  };

// Create Course (already defined, refined here)
const createCourse = async (req, res) => {
    const { title, description, quizzes } = req.body;
    const files = req.files; // Array of video files from multer
  
    try {
      const user = await require('../models/user.js').findById(req.user.id);
      if (user.role !== 'instructor') {
        return res.status(403).json({ message: 'Only instructors can create courses' });
      }
  
      const lessons = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const videoURL = await uploadVideoToCloudinary(file);
          lessons.push({
            title: file.originalname.split('.')[0], // Use filename as title (customize as needed)
            videoURL,
          });
        }
      }
  
      const course = new Course({
        title,
        description,
        instructor: req.user.id,
        lessons,
        quizzes: quizzes ? JSON.parse(quizzes) : [], // Parse quizzes if sent as string
      });
  
      await course.save();
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Read All Courses (already defined)
// const getAllCourses = async (req, res) => {
//   try {
//     const courses = await Course.find().populate('instructor', 'name email');
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email _id');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Read Single Course (already defined)
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Course (add or replace videos)
const updateCourse = async (req, res) => {
    const { title, description, quizzes } = req.body;
    const files = req.files;
  
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      if (course.instructor.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      if (title) course.title = title;
      if (description) course.description = description;
      if (quizzes) course.quizzes = JSON.parse(quizzes);
  
      if (files && files.length > 0) {
        const newLessons = [];
        for (const file of files) {
          const videoURL = await uploadVideoToCloudinary(file);
          newLessons.push({
            title: file.originalname.split('.')[0],
            videoURL,
          });
        }
        course.lessons = [...course.lessons, ...newLessons]; // Append new lessons
      }
  
      await course.save();
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Delete Course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await course.remove();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };