const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessons: [
    {
      title: { type: String, required: true },
      videoURL: { type: String, required: true }, // URL to video (e.g., Cloudinary/AWS S3 link)
      duration: { type: Number }, // Duration in seconds (optional)
    },
  ],
  quizzes: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);