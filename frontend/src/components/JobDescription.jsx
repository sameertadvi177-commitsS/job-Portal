import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Briefcase, MapPin, Clock, IndianRupee, Users, Calendar, Loader2 } from 'lucide-react';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <Navbar />
                <div className='flex items-center justify-center h-[60vh]'>
                    <Loader2 className='w-8 h-8 animate-spin text-[#6A38C2]' />
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-4xl mx-auto my-10 px-4'>
                {/* Header Card */}
                <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8'>
                    <div className='flex items-start justify-between'>
                        <div>
                            <h1 className='font-bold text-2xl text-gray-900'>{singleJob?.title}</h1>
                            <div className='flex items-center gap-2 mt-3 flex-wrap'>
                                <Badge className='text-blue-700 font-medium bg-blue-50 border-blue-200 hover:bg-blue-100' variant="outline">{singleJob?.position} Positions</Badge>
                                <Badge className='text-[#F83002] font-medium bg-orange-50 border-orange-200 hover:bg-orange-100' variant="outline">{singleJob?.jobType}</Badge>
                                <Badge className='text-[#7209b7] font-medium bg-purple-50 border-purple-200 hover:bg-purple-100' variant="outline">{singleJob?.salary} LPA</Badge>
                            </div>
                        </div>
                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-lg px-6 ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6A38C2] hover:bg-[#5b30a6]'}`}
                        >
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                    </div>

                    {/* Details Grid */}
                    <div className='mt-8 border-t border-gray-100 pt-6'>
                        <h2 className='font-semibold text-lg text-gray-800 mb-4'>Job Details</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <Briefcase className='w-4 h-4 text-[#6A38C2]' />
                                <span className='text-sm font-medium text-gray-500'>Role:</span>
                                <span className='text-sm text-gray-800'>{singleJob?.title}</span>
                            </div>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <MapPin className='w-4 h-4 text-[#6A38C2]' />
                                <span className='text-sm font-medium text-gray-500'>Location:</span>
                                <span className='text-sm text-gray-800'>{singleJob?.location}</span>
                            </div>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <Clock className='w-4 h-4 text-[#6A38C2]' />
                                <span className='text-sm font-medium text-gray-500'>Experience:</span>
                                <span className='text-sm text-gray-800'>{singleJob?.experience} yrs</span>
                            </div>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <IndianRupee className='w-4 h-4 text-[#6A38C2]' />
                                <span className='text-sm font-medium text-gray-500'>Salary:</span>
                                <span className='text-sm text-gray-800'>{singleJob?.salary} LPA</span>
                            </div>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <Users className='w-4 h-4 text-[#6A38C2]' />
                                <span className='text-sm font-medium text-gray-500'>Applicants:</span>
                                <span className='text-sm text-gray-800'>{singleJob?.applications?.length}</span>
                            </div>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <Calendar className='w-4 h-4 text-[#6A38C2]' />
                                <span className='text-sm font-medium text-gray-500'>Posted:</span>
                                <span className='text-sm text-gray-800'>{singleJob?.createdAt?.split("T")[0]}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='mt-6 border-t border-gray-100 pt-6'>
                        <h2 className='font-semibold text-lg text-gray-800 mb-3'>Description</h2>
                        <p className='text-sm text-gray-600 leading-relaxed'>{singleJob?.description}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default JobDescription