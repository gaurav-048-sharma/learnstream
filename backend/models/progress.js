const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonsCompleted: [{ type: Number }], // Indices of completed lessons
  quizScores: [{ questionIndex: Number, score: Number }], // Scores for each quiz
  completionPercentage: { type: Number, default: 0 },
  completedAt: { type: Date },
});

module.exports = mongoose.model('Progress', progressSchema);