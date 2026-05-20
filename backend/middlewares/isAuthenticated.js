import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please login.",
                success: false,
            })
        }

        if (!process.env.SECRET_KEY) {
            console.error("FATAL: SECRET_KEY is not set in environment variables!");
            return res.status(500).json({
                message: "Server configuration error.",
                success: false,
            });
        }

        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                message: "Invalid token payload.",
                success: false,
            });
        }

        req.id = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Session expired. Please login again.",
                success: false,
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid authentication token.",
                success: false,
            });
        }
        console.log(error);
        return res.status(401).json({ message: "Authentication failed.", success: false });
    }
}
export default isAuthenticated;