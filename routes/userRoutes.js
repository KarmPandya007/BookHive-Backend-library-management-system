import express from "express";
import {
    getAllUsers,
    getUserById,
    registerUser,
    updateUserById,
    deleteUserById,
    deleteAllUsers,
    loginUser,
    getUserProfile
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Admin/Protected routes
router.get('/', protect, admin, getAllUsers);
router.delete('/', protect, admin, deleteAllUsers);

router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, updateUserById);
router.delete('/:id', protect, admin, deleteUserById);

export default router;