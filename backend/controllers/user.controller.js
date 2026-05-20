import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Validation helpers
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\d{10,15}$/.test(String(phone));
const isValidRole = (role) => ['student', 'recruiter'].includes(role);

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        // Required fields check
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required: fullname, email, phoneNumber, password, role",
                success: false
            });
        };

        // Fullname validation
        if (fullname.trim().length < 2) {
            return res.status(400).json({
                message: "Full name must be at least 2 characters long.",
                success: false
            });
        }

        // Email format validation
        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address.",
                success: false
            });
        }

        // Phone number validation
        if (!isValidPhone(phoneNumber)) {
            return res.status(400).json({
                message: "Please provide a valid phone number (10-15 digits).",
                success: false
            });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long.",
                success: false
            });
        }

        // Role validation
        if (!isValidRole(role)) {
            return res.status(400).json({
                message: "Role must be either 'student' or 'recruiter'.",
                success: false
            });
        }

        // Profile photo upload
        const file = req.file;
        let cloudResponse;
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname: fullname.trim(),
            email: email.toLowerCase().trim(),
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse?.secure_url || "",
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        // Required fields check
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password and role are required.",
                success: false
            });
        };

        // Email format validation
        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address.",
                success: false
            });
        }

        // Role validation
        if (!isValidRole(role)) {
            return res.status(400).json({
                message: "Role must be either 'student' or 'recruiter'.",
                success: false
            });
        }

        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        // Validate email if provided
        if (email && !isValidEmail(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address.",
                success: false
            });
        }

        // Validate phone if provided
        if (phoneNumber && !isValidPhone(phoneNumber)) {
            return res.status(400).json({
                message: "Please provide a valid phone number (10-15 digits).",
                success: false
            });
        }

        // Validate fullname if provided
        if (fullname && fullname.trim().length < 2) {
            return res.status(400).json({
                message: "Full name must be at least 2 characters long.",
                success: false
            });
        }

        // Upload resume to cloudinary if file provided
        let cloudResponse;
        if (file) {
            // Validate file type for resume
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    message: "Resume must be a PDF or Word document.",
                    success: false
                });
            }
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                return res.status(400).json({
                    message: "Resume file size must be less than 5MB.",
                    success: false
                });
            }
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",").map(s => s.trim()).filter(s => s.length > 0);
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            })
        }

        // Check if email is being changed to one that already exists
        if (email && email.toLowerCase().trim() !== user.email) {
            const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
            if (emailExists) {
                return res.status(400).json({
                    message: "Email is already in use by another account.",
                    success: false
                });
            }
        }

        // updating data
        if(fullname) user.fullname = fullname.trim()
        if(email) user.email = email.toLowerCase().trim()
        if(phoneNumber) user.phoneNumber = phoneNumber
        if(bio !== undefined) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
      
        // resume
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url
            user.profile.resumeOriginalName = file.originalname
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}