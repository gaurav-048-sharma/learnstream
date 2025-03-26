const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } = require('../controllers/courceController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const upload = require('../middleware/upload.js');

router.post('/', authMiddleware, upload.array('videos'), createCourse); // Handle multiple video uploads
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', authMiddleware, upload.array('videos'), updateCourse); // Update with new videos
router.delete('/:id', authMiddleware, deleteCourse);

module.exports = router;