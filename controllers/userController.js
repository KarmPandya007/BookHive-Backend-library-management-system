import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            id: user.id,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, phone, address, id, password, role } = req.body;

    const userExists = await User.findOne({
        $or: [{ email }, { phone }, { id }]
    }).select('_id').lean();

    if (userExists) {
        res.status(400);
        throw new Error("User with this email, phone, or ID already exists.");
    }

    const user = await User.create({ name, email, phone, address, id, password, role });

    if (user) {
        res.status(201).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            id: user.id,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;

    if (user) {
        res.json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            id: user.id,
            phone: user.phone,
            address: user.address,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find({}).skip(skip).limit(limit).lean(),
        User.estimatedDocumentCount()
    ]);

    res.status(200).json({
        success: true,
        count: users.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        users
    });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json({ success: true, user });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({ success: true, message: "User updated successfully", user });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
});

// @desc    Delete all users
// @route   DELETE /api/users
// @access  Private/Admin
export const deleteAllUsers = asyncHandler(async (req, res) => {
    const result = await User.deleteMany({});
    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error("No users found to delete.");
    }
    res.status(200).json({ success: true, message: "All users deleted successfully." });
});
