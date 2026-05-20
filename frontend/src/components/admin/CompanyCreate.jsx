import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Building2 } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
    const dispatch = useDispatch();
    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }
    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-2xl mx-auto my-10 px-4'>
                <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8'>
                    {/* Header */}
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='p-2 bg-[#6A38C2]/10 rounded-lg'>
                            <Building2 className='w-6 h-6 text-[#6A38C2]' />
                        </div>
                        <div>
                            <h1 className='font-bold text-xl text-gray-900'>Register New Company</h1>
                            <p className='text-sm text-gray-500'>What would you like to name your company? You can change this later.</p>
                        </div>
                    </div>

                    <div className='mb-6'>
                        <Label className='text-sm font-medium text-gray-700'>Company Name</Label>
                        <Input
                            type="text"
                            className="mt-1"
                            placeholder="e.g. Microsoft, Google, JobHunt"
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <div className='flex items-center gap-3'>
                        <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
                        <Button onClick={registerNewCompany} className="bg-[#6A38C2] hover:bg-[#5b30a6]">Continue</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate