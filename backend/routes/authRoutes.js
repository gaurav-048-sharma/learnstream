const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser); // Protect logout with auth

module.exports = router;