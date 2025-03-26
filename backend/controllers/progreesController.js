const Progress = require('../models/progress.js');
const Course = require('../models/course.js');

// Create or Update Progress
const updateProgress = async (req, res) => {
  const { courseId, lessonsCompleted, quizScores } = req.body;

  try {
    let progress = await Progress.findOne({ user: req.user.id, course: courseId });
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const totalLessons = course.lessons.length;
    const totalQuizzes = course.quizzes.length;

    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        course: courseId,
        lessonsCompleted: lessonsCompleted || [],
        quizScores: quizScores || [],
      });
    } else {
      if (lessonsCompleted) progress.lessonsCompleted = lessonsCompleted;
      if (quizScores) progress.quizScores = quizScores;
    }

    // Calculate completion percentage
    const lessonsDone = progress.lessonsCompleted.length;
    const quizzesDone = progress.quizScores.length;
    progress.completionPercentage = ((lessonsDone + quizzesDone) / (totalLessons + totalQuizzes)) * 100;

    if (progress.completionPercentage === 100 && !progress.completedAt) {
      progress.completedAt = new Date();
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Read Progress for a User
const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id }).populate('course', 'title');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Read Progress for a Specific Course
const getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });
    if (!progress) return res.status(404).json({ message: 'Progress not found' });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Progress (optional, e.g., reset progress)
const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    await progress.remove();
    res.json({ message: 'Progress deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateProgress, getUserProgress, getCourseProgress, deleteProgress };