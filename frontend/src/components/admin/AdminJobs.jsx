import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Briefcase, Plus, Search } from 'lucide-react'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10 px-4'>
        {/* Page Header */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 bg-[#6A38C2]/10 rounded-lg'>
            <Briefcase className='w-6 h-6 text-[#6A38C2]' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Posted Jobs</h1>
            <p className='text-sm text-gray-500'>Manage your job listings</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4'>
          <div className='flex items-center justify-between'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                className="pl-9 w-64"
                placeholder="Filter by name, role..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate("/admin/jobs/create")} className="bg-[#6A38C2] hover:bg-[#5b30a6]">
              <Plus className='w-4 h-4 mr-2' />
              New Job
            </Button>
          </div>
        </div>

        {/* Table Card */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
          <AdminJobsTable />
        </div>
      </div>
    </div>
  )
}

export default AdminJobs