import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import Footer from '../shared/Footer'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            if (user.role === 'recruiter') {
                navigate("/admin/companies");
            } else {
                navigate("/");
            }
        }
    }, [user, navigate])
    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='flex items-center justify-center min-h-[calc(100vh-8rem)] px-4'>
                <form onSubmit={submitHandler} className='w-full max-w-md bg-white shadow-lg rounded-xl p-8 my-10 border border-gray-100'>
                    <h1 className='font-bold text-2xl mb-2 text-gray-900'>Create Account</h1>
                    <p className='text-sm text-gray-500 mb-6'>Join JobPortal to find your dream job or hire talent</p>

                    <div className='mb-4'>
                        <Label className='text-sm font-medium text-gray-700'>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="John Doe"
                            className='mt-1'
                        />
                    </div>
                    <div className='mb-4'>
                        <Label className='text-sm font-medium text-gray-700'>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="you@example.com"
                            className='mt-1'
                        />
                    </div>
                    <div className='mb-4'>
                        <Label className='text-sm font-medium text-gray-700'>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="9876543210"
                            className='mt-1'
                        />
                    </div>
                    <div className='mb-4'>
                        <Label className='text-sm font-medium text-gray-700'>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="••••••••"
                            className='mt-1'
                        />
                    </div>

                    <div className='mb-4'>
                        <Label className='text-sm font-medium text-gray-700 mb-2 block'>I am a</Label>
                        <RadioGroup className="flex items-center gap-6">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <Label>Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <Label>Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className='mb-6'>
                        <Label className='text-sm font-medium text-gray-700'>Profile Photo</Label>
                        <Input
                            accept="image/*"
                            type="file"
                            onChange={changeFileHandler}
                            className="cursor-pointer mt-1"
                        />
                    </div>

                    {
                        loading
                            ? <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]" disabled> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button>
                            : <Button type="submit" className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">Sign Up</Button>
                    }

                    <p className='text-sm text-center mt-4 text-gray-500'>
                        Already have an account? <Link to="/login" className='text-[#6A38C2] font-medium hover:underline'>Login</Link>
                    </p>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default Signup