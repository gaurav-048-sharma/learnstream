const express = require('express');
const router = express.Router();
const { updateProgress, getUserProgress, getCourseProgress, deleteProgress } = require('../controllers/progreesController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/', authMiddleware, updateProgress); // Create/Update progress
router.get('/', authMiddleware, getUserProgress); // Get all progress for user
router.get('/:courseId', authMiddleware, getCourseProgress); // Get progress for a course
router.delete('/:courseId', authMiddleware, deleteProgress); // Delete progress

module.exports = router;