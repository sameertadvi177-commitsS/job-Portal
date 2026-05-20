import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("FATAL: MONGO_URI is not defined in environment variables!");
            process.exit(1);
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection FAILED:");
        if (error.code === 8000 || error.codeName === 'AtlasError') {
            console.error("  → Authentication failed. Please check your MONGO_URI username and password in .env");
        } else if (error.name === 'MongoNetworkError') {
            console.error("  → Network error. Check your internet connection and MongoDB Atlas whitelist.");
        } else if (error.name === 'MongoParseError') {
            console.error("  → Invalid MONGO_URI format. Check your connection string in .env");
        } else {
            console.error(`  → ${error.message}`);
        }
        console.error("  → Server will continue running but database operations will fail.");
    }
}
export default connectDB