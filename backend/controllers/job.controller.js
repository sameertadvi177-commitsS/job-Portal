import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

// admin post job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        // Required fields check
        if (!title || !description || !requirements || !salary || !location || !jobType || experience === undefined || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required: title, description, requirements, salary, location, jobType, experience, position, companyId",
                success: false
            })
        };

        // Title validation
        if (title.trim().length < 3) {
            return res.status(400).json({
                message: "Job title must be at least 3 characters long.",
                success: false
            });
        }

        // Description validation
        if (description.trim().length < 10) {
            return res.status(400).json({
                message: "Job description must be at least 10 characters long.",
                success: false
            });
        }

        // Salary validation
        const salaryNum = Number(salary);
        if (isNaN(salaryNum) || salaryNum <= 0) {
            return res.status(400).json({
                message: "Salary must be a positive number.",
                success: false
            });
        }

        // Experience validation
        const experienceNum = Number(experience);
        if (isNaN(experienceNum) || experienceNum < 0) {
            return res.status(400).json({
                message: "Experience must be a non-negative number.",
                success: false
            });
        }

        // Position validation
        const positionNum = Number(position);
        if (isNaN(positionNum) || positionNum <= 0 || !Number.isInteger(positionNum)) {
            return res.status(400).json({
                message: "Position must be a positive integer.",
                success: false
            });
        }

        // CompanyId validation
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID.",
                success: false
            });
        }

        const job = await Job.create({
            title: title.trim(),
            description: description.trim(),
            requirements: requirements.split(",").map(r => r.trim()).filter(r => r.length > 0),
            salary: salaryNum,
            location: location.trim(),
            jobType: jobType.trim(),
            experience: experienceNum,
            position: positionNum,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// student - get all jobs with filters, search, sort & pagination
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const location = req.query.location || "";
        const jobType = req.query.jobType || "";
        const salaryMin = Number(req.query.salaryMin) || 0;
        const salaryMax = Number(req.query.salaryMax) || 0;
        const experience = Number(req.query.experience) || 0;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));

        // Validate salary range
        if (salaryMin > 0 && salaryMax > 0 && salaryMin > salaryMax) {
            return res.status(400).json({
                message: "salaryMin cannot be greater than salaryMax.",
                success: false
            });
        }

        // Build dynamic query
        const query = {};

        // Text search on title and description
        if (keyword) {
            // Escape regex special characters to prevent ReDoS
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                { title: { $regex: escapedKeyword, $options: "i" } },
                { description: { $regex: escapedKeyword, $options: "i" } },
            ];
        }

        // Location filter
        if (location) {
            const escapedLocation = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.location = { $regex: escapedLocation, $options: "i" };
        }

        // Job type filter
        if (jobType) {
            const escapedJobType = jobType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.jobType = { $regex: escapedJobType, $options: "i" };
        }

        // Salary range filter
        if (salaryMin > 0 || salaryMax > 0) {
            query.salary = {};
            if (salaryMin > 0) query.salary.$gte = salaryMin;
            if (salaryMax > 0) query.salary.$lte = salaryMax;
        }

        // Experience filter
        if (experience > 0) {
            query.experience = { $lte: experience };
        }

        // Build sort object
        const allowedSortFields = ["createdAt", "salary", "experience"];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
        const sortDir = sortOrder === "asc" ? 1 : -1;
        const sort = { [sortField]: sortDir };

        // Get total count for pagination
        const totalJobs = await Job.countDocuments(query);
        const totalPages = Math.ceil(totalJobs / limit);
        const skip = (page - 1) * limit;

        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            jobs,
            pagination: {
                currentPage: page,
                totalPages,
                totalJobs,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// student - get job by id
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID format.",
                success: false
            });
        }

        const job = await Job.findById(jobId).populate({
            path: "applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// admin - get all jobs created by this admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company'
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
