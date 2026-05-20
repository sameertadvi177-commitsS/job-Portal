import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

const locations = ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Delhi", "Remote"];
const industries = ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science", "Artificial Intelligence"];
const jobTypes = ["Full-time", "Part-time", "Internship", "Contract"];

const companiesData = [
    { name: "TechCorp India", description: "Leading tech solutions.", website: "https://techcorp.in", location: "Bangalore" },
    { name: "Innovate AI", description: "AI research and development.", website: "https://innovateai.com", location: "Hyderabad" },
    { name: "FinTech Solutions", description: "Financial technology services.", website: "https://fintech.com", location: "Mumbai" },
    { name: "Global Systems", description: "Enterprise software.", website: "https://globalsystems.com", location: "Pune" },
    { name: "Creative Web Agency", description: "Web design and development.", website: "https://creativeweb.com", location: "Remote" }
];

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for seeding.");

        // Find a user to act as the creator (preferably recruiter)
        let user = await User.findOne({ role: "recruiter" });
        if (!user) {
            user = await User.findOne({});
            if (!user) {
                console.log("No user found in the database. Please create a user (recruiter) first.");
                process.exit(1);
            }
        }
        console.log(`Using user ${user.email} as creator.`);

        // Create companies
        const createdCompanies = [];
        for (const cData of companiesData) {
            // Check if company exists to avoid unique constraint errors
            let company = await Company.findOne({ name: cData.name });
            if (!company) {
                company = await Company.create({
                    ...cData,
                    userId: user._id
                });
                console.log(`Created company: ${company.name}`);
            } else {
                console.log(`Company ${company.name} already exists.`);
            }
            createdCompanies.push(company);
        }

        // Create jobs
        const jobsToCreate = [];
        for (let i = 0; i < 25; i++) {
            const industry = industries[Math.floor(Math.random() * industries.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
            const company = createdCompanies[Math.floor(Math.random() * createdCompanies.length)];
            const experience = [0, 2, 5, 10][Math.floor(Math.random() * 4)];
            const salary = Math.floor(Math.random() * 30) + 3; // 3 to 32 LPA

            jobsToCreate.push({
                title: `${industry} (${i+1})`,
                description: `We are looking for a skilled ${industry} to join our team in ${location}. You will be responsible for developing high-quality solutions.`,
                requirements: ["React", "Node.js", "MongoDB", "Problem Solving", "Teamwork"].sort(() => 0.5 - Math.random()).slice(0, 3),
                salary: salary,
                experience: experience,
                location: location,
                jobType: jobType,
                position: Math.floor(Math.random() * 5) + 1,
                company: company._id,
                created_by: user._id
            });
        }

        await Job.insertMany(jobsToCreate);
        console.log(`Created ${jobsToCreate.length} dummy jobs successfully.`);

        console.log("Seeding complete.");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
