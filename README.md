# Job Portal

A premium and modern job portal built using the MERN stack (MongoDB, Express, React, Node.js) and Redux Toolkit.

## Key Features
- **Modern User Interface**: Responsive layouts with clean, beautiful gradients and glassmorphism styling.
- **Robust Searching, Filtering, and Sorting**: Fully functional server-side pagination, independent multi-filter categories, and sorting.
- **Secure Authentication**: High-security session management with httpOnly cookies.
- **Admin Dashboard**: Register companies, post job openings, track applicants, and manage application statuses.
- **Input Validation**: Extensive server-side input validation and error handling.
- **Detailed API Test Suite**: Build validation check scripts to verify functionality.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Shadcn UI, Redux Toolkit
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Cloudinary, Multer

## Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and set your MongoDB URI, JWT secret, and Cloudinary keys:
   ```env
   PORT=8000
   MONGO_URI=mongodb+srv://...
   SECRET_KEY=your_jwt_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

### Testing APIs
You can run the built-in API test suite to verify connectivity and validation rules:
```bash
cd backend
node test-api.js
```
"# job-Portal" 
