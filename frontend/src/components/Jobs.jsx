import React from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setFilters } from '@/redux/jobSlice';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Loader2, SlidersHorizontal } from 'lucide-react';
import Footer from './shared/Footer';

const Jobs = () => {
    useGetAllJobs();
    const dispatch = useDispatch();
    const { allJobs, filters, pagination, jobsLoading } = useSelector(store => store.job);

    const handleSortChange = (e) => {
        const value = e.target.value;
        let sortBy = "createdAt";
        let sortOrder = "desc";

        switch (value) {
            case "newest":
                sortBy = "createdAt"; sortOrder = "desc"; break;
            case "oldest":
                sortBy = "createdAt"; sortOrder = "asc"; break;
            case "salary_high":
                sortBy = "salary"; sortOrder = "desc"; break;
            case "salary_low":
                sortBy = "salary"; sortOrder = "asc"; break;
            default:
                break;
        }
        dispatch(setFilters({ sortBy, sortOrder, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setFilters({ page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getCurrentSortValue = () => {
        if (filters.sortBy === "createdAt" && filters.sortOrder === "desc") return "newest";
        if (filters.sortBy === "createdAt" && filters.sortOrder === "asc") return "oldest";
        if (filters.sortBy === "salary" && filters.sortOrder === "desc") return "salary_high";
        if (filters.sortBy === "salary" && filters.sortOrder === "asc") return "salary_low";
        return "newest";
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                {/* Header with sort */}
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                        <SlidersHorizontal className='w-5 h-5 text-gray-500' />
                        <h2 className='text-lg font-semibold text-gray-700'>
                            {pagination.totalJobs} {pagination.totalJobs === 1 ? 'Job' : 'Jobs'} Found
                        </h2>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='text-sm text-gray-500'>Sort by:</label>
                        <select
                            value={getCurrentSortValue()}
                            onChange={handleSortChange}
                            className='text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent'
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="salary_high">Salary: High to Low</option>
                            <option value="salary_low">Salary: Low to High</option>
                        </select>
                    </div>
                </div>

                <div className='flex gap-5'>
                    {/* Filter sidebar */}
                    <div className='w-[280px] flex-shrink-0'>
                        <FilterCard />
                    </div>

                    {/* Job listings */}
                    <div className='flex-1 pb-5'>
                        {jobsLoading ? (
                            <div className='flex items-center justify-center h-[60vh]'>
                                <div className='flex flex-col items-center gap-3'>
                                    <Loader2 className='w-8 h-8 animate-spin text-[#6A38C2]' />
                                    <p className='text-gray-500 text-sm'>Loading jobs...</p>
                                </div>
                            </div>
                        ) : allJobs.length <= 0 ? (
                            <div className='flex items-center justify-center h-[60vh]'>
                                <div className='text-center'>
                                    <p className='text-4xl mb-3'>🔍</p>
                                    <h3 className='text-lg font-semibold text-gray-700'>No jobs found</h3>
                                    <p className='text-sm text-gray-500 mt-1'>Try adjusting your filters or search criteria</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {allJobs.map((job) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            key={job?._id}
                                        >
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className='flex items-center justify-center gap-2 mt-8'>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={!pagination.hasPrevPage}
                                            className='flex items-center gap-1'
                                        >
                                            <ChevronLeft className='w-4 h-4' />
                                            Previous
                                        </Button>

                                        <div className='flex items-center gap-1'>
                                            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                                let pageNum;
                                                if (pagination.totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (pagination.currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                                    pageNum = pagination.totalPages - 4 + i;
                                                } else {
                                                    pageNum = pagination.currentPage - 2 + i;
                                                }
                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={pagination.currentPage === pageNum ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`w-9 h-9 ${pagination.currentPage === pageNum ? 'bg-[#6A38C2] hover:bg-[#5b30a6]' : ''}`}
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                );
                                            })}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={!pagination.hasNextPage}
                                            className='flex items-center gap-1'
                                        >
                                            Next
                                            <ChevronRight className='w-4 h-4' />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Jobs