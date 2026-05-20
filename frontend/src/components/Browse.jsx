import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { resetFilters } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Loader2 } from 'lucide-react';
import Footer from './shared/Footer';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, filters, jobsLoading } = useSelector(store => store.job);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(resetFilters());
        }
    }, [dispatch]);

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <h1 className='font-bold text-xl my-5'>
                    {filters.keyword
                        ? `Search Results for "${filters.keyword}" (${allJobs.length})`
                        : `Browse All Jobs (${allJobs.length})`
                    }
                </h1>
                {jobsLoading ? (
                    <div className='flex items-center justify-center h-[40vh]'>
                        <Loader2 className='w-8 h-8 animate-spin text-[#6A38C2]' />
                    </div>
                ) : allJobs.length <= 0 ? (
                    <div className='flex items-center justify-center h-[40vh]'>
                        <div className='text-center'>
                            <p className='text-4xl mb-3'>🔍</p>
                            <h3 className='text-lg font-semibold text-gray-700'>No jobs found</h3>
                            <p className='text-sm text-gray-500 mt-1'>Try a different search term</p>
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {allJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default Browse