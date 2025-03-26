const PDFDocument = require('pdfkit');
const Progress = require('../models/progress');
const Course = require('../models/course');
const User = require('../models/user');

const generateCertificate = async (req, res) => {
  const { courseId } = req.params;

  try {
    // Fetch progress
    const progress = await Progress.findOne({ user: req.user.id, course: courseId });
    if (!progress || progress.completionPercentage !== 100) {
      return res.status(400).json({ message: 'Course not completed' });
    }

    // Fetch course and user details
    const course = await Course.findById(courseId);
    const user = await User.findById(req.user.id);

    if (!course || !user) {
      return res.status(404).json({ message: 'Course or user not found' });
    }

    // Create PDF
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${courseId}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Design the certificate
    doc.fontSize(40).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`This certifies that`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(30).text(user.name, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`has successfully completed the course`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(25).text(course.title, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(15).text(`Date: ${new Date(progress.completedAt).toLocaleDateString()}`, { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { generateCertificate };