import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { setCompanies, setSingleCompany } from '@/redux/companySlice'
import { setAllAdminJobs, setAllAppliedJobs } from '@/redux/jobSlice'
import { setAllApplicants } from '@/redux/applicationSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const linkClass = (path) =>
        `transition-colors duration-200 ${isActive(path)
            ? 'text-[#6A38C2] font-semibold'
            : 'text-gray-700 hover:text-[#6A38C2]'
        }`;

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                dispatch(setCompanies([]));
                dispatch(setSingleCompany(null));
                dispatch(setAllAdminJobs([]));
                dispatch(setAllAppliedJobs([]));
                dispatch(setAllApplicants(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='bg-white shadow-sm sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div>
                    <Link to="/">
                        <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                    </Link>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" className={linkClass('/admin/companies')}>Companies</Link></li>
                                    <li><Link to="/admin/jobs" className={linkClass('/admin/jobs')}>Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className={linkClass('/')}>Home</Link></li>
                                    <li><Link to="/jobs" className={linkClass('/jobs')}>Jobs</Link></li>
                                    <li><Link to="/browse" className={linkClass('/browse')}>Browse</Link></li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                        <AvatarFallback className="bg-[#6A38C2] text-white font-bold">
                                            {user?.fullname ? user.fullname.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0">
                                    {/* User Info */}
                                    <div className='flex items-center gap-3 p-4 border-b border-gray-100'>
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                            <AvatarFallback className="bg-[#6A38C2] text-white font-bold text-lg">
                                                {user?.fullname ? user.fullname.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className='min-w-0'>
                                            <h4 className='font-semibold text-gray-900 truncate'>{user?.fullname}</h4>
                                            <p className='text-sm text-gray-500 truncate'>{user?.profile?.bio || user?.email}</p>
                                        </div>
                                    </div>
                                    {/* Menu Items */}
                                    <div className='py-1'>
                                        <Link to="/profile"
                                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'
                                        >
                                            <User2 className='w-4 h-4' />
                                            <span>View Profile</span>
                                        </Link>
                                        <div
                                            onClick={logoutHandler}
                                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer'
                                        >
                                            <LogOut className='w-4 h-4' />
                                            <span>Logout</span>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar