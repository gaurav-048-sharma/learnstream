const express = require('express');
const router = express.Router();
const { generateCertificate } = require('../controllers/certificateController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.get('/:courseId', authMiddleware, generateCertificate);

module.exports = router;