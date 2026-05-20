import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import Footer from './shared/Footer'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-4xl mx-auto my-10 px-4'>
                {/* Profile Card */}
                <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-8'>
                    <div className='flex justify-between items-start'>
                        <div className='flex items-center gap-5'>
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                <AvatarFallback className="bg-[#6A38C2] text-white font-bold text-2xl">
                                    {user?.fullname ? user.fullname.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className='font-semibold text-xl text-gray-900'>{user?.fullname}</h1>
                                <p className='text-gray-500 text-sm mt-1'>{user?.profile?.bio || "No bio added yet"}</p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} variant="outline" size="icon" className="rounded-full h-10 w-10">
                            <Pen className='w-4 h-4' />
                        </Button>
                    </div>

                    {/* Contact Info */}
                    <div className='mt-6 pt-6 border-t border-gray-100'>
                        <div className='flex items-center gap-3 my-3'>
                            <Mail className='w-4 h-4 text-gray-400' />
                            <span className='text-sm text-gray-700'>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 my-3'>
                            <Contact className='w-4 h-4 text-gray-400' />
                            <span className='text-sm text-gray-700'>{user?.phoneNumber || "Not provided"}</span>
                        </div>
                    </div>

                    {/* Student-specific sections */}
                    {
                        user?.role === 'student' && (
                            <>
                                {/* Skills */}
                                <div className='mt-6 pt-6 border-t border-gray-100'>
                                    <h2 className='font-semibold text-md text-gray-800 mb-3'>Skills</h2>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        {
                                            user?.profile?.skills && user.profile.skills.length !== 0
                                                ? user.profile.skills.map((item, index) => (
                                                    <Badge key={index} className='bg-[#6A38C2]/10 text-[#6A38C2] border-[#6A38C2]/20 hover:bg-[#6A38C2]/15' variant="outline">
                                                        {item}
                                                    </Badge>
                                                ))
                                                : <span className='text-sm text-gray-400'>No skills added yet</span>
                                        }
                                    </div>
                                </div>

                                {/* Resume */}
                                <div className='mt-6 pt-6 border-t border-gray-100'>
                                    <Label className="text-md font-semibold text-gray-800">Resume</Label>
                                    <div className='mt-2'>
                                        {
                                            user?.profile?.resume
                                                ? (
                                                    <a
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        href={user?.profile?.resume}
                                                        className='inline-flex items-center gap-2 text-[#6A38C2] hover:underline text-sm font-medium'
                                                    >
                                                        <FileText className='w-4 h-4' />
                                                        {user?.profile?.resumeOriginalName || "View Resume"}
                                                    </a>
                                                )
                                                : <span className='text-sm text-gray-400'>No resume uploaded yet</span>
                                        }
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>

                {/* Applied Jobs Table */}
                {
                    user?.role === 'student' && (
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6'>
                            <h2 className='font-semibold text-lg text-gray-800 mb-4'>Applied Jobs</h2>
                            <AppliedJobTable />
                        </div>
                    )
                }
            </div>
            <Footer />
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile