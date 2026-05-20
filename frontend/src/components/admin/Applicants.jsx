import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { Users } from 'lucide-react';
import { Badge } from '../ui/badge';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);
    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                {/* Page Header */}
                <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2 bg-[#6A38C2]/10 rounded-lg'>
                        <Users className='w-6 h-6 text-[#6A38C2]' />
                    </div>
                    <div className='flex items-center gap-3'>
                        <h1 className='text-2xl font-bold text-gray-900'>Applicants</h1>
                        <Badge className='bg-[#6A38C2] text-white text-sm px-3 py-0.5'>
                            {applicants?.applications?.length || 0}
                        </Badge>
                    </div>
                </div>

                {/* Table Card */}
                <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                    <ApplicantsTable />
                </div>
            </div>
        </div>
    )
}

export default Applicants