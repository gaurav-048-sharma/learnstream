const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/', createUser); // Public (signup)
router.get('/', authMiddleware, getAllUsers); // Protected (admin only, optional)
router.get('/:id', authMiddleware, getUserById); // Protected
router.put('/:id', authMiddleware, updateUser); // Protected
router.delete('/:id', authMiddleware, deleteUser); // Protected

module.exports = router;