import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        // Validate company name
        if (!companyName || companyName.trim().length < 2) {
            return res.status(400).json({
                message: "Company name is required and must be at least 2 characters long.",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName.trim() });
        if (company) {
            return res.status(400).json({
                message: "A company with this name already exists.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName.trim(),
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID format.",
                success: false
            });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        // Validate company ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid company ID format.",
                success: false
            });
        }

        // Validate name if provided
        if (name !== undefined && name.trim().length < 2) {
            return res.status(400).json({
                message: "Company name must be at least 2 characters long.",
                success: false
            });
        }

        // Validate website URL if provided
        if (website && website.trim().length > 0 && !isValidUrl(website)) {
            return res.status(400).json({
                message: "Please provide a valid website URL (e.g., https://example.com).",
                success: false
            });
        }

        const file = req.file;
        // Upload logo to cloudinary if file provided
        let logo;
        if (file) {
            // Validate file type for logo
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    message: "Logo must be an image file (JPEG, PNG, WebP, GIF, or SVG).",
                    success: false
                });
            }
            // Validate file size (2MB max for logo)
            if (file.size > 2 * 1024 * 1024) {
                return res.status(400).json({
                    message: "Logo file size must be less than 2MB.",
                    success: false
                });
            }
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (website !== undefined) updateData.website = website.trim();
        if (location !== undefined) updateData.location = location.trim();
        if (logo) updateData.logo = logo;

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message: "Company information updated.",
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}