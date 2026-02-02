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
router.route('/')
    .get(protect, admin, getAllUsers)
    .delete(protect, admin, deleteAllUsers);

router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, updateUserById)
    .delete(protect, admin, deleteUserById);

export default router;