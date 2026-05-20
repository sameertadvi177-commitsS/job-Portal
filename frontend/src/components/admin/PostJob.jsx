import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany._id });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-3xl mx-auto my-10 px-4'>
                <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8'>
                    {/* Header */}
                    <div className='flex items-center gap-4 mb-8'>
                        <Button onClick={() => navigate("/admin/jobs")} variant="outline" size="icon" className="rounded-full h-9 w-9">
                            <ArrowLeft className='w-4 h-4' />
                        </Button>
                        <div>
                            <h1 className='font-bold text-xl text-gray-900'>Post New Job</h1>
                            <p className='text-sm text-gray-500'>Fill in the details to create a job listing</p>
                        </div>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. Frontend Developer"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    placeholder="Brief job description"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Requirements</Label>
                                <Input
                                    type="text"
                                    name="requirements"
                                    value={input.requirements}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. React, Node.js, MongoDB"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Salary (LPA)</Label>
                                <Input
                                    type="text"
                                    name="salary"
                                    value={input.salary}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. 12"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Location</Label>
                                <Input
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. Bangalore"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Job Type</Label>
                                <Input
                                    type="text"
                                    name="jobType"
                                    value={input.jobType}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. Full-time"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Experience (yrs)</Label>
                                <Input
                                    type="text"
                                    name="experience"
                                    value={input.experience}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. 2"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>No. of Positions</Label>
                                <Input
                                    type="number"
                                    name="position"
                                    value={input.position}
                                    onChange={changeEventHandler}
                                    className="mt-1"
                                />
                            </div>
                            {
                                companies.length > 0 && (
                                    <div className='md:col-span-2'>
                                        <Label className='text-sm font-medium text-gray-700'>Select Company</Label>
                                        <Select onValueChange={selectChangeHandler}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Choose a company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        companies.map((company) => {
                                                            return (
                                                                <SelectItem key={company._id} value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                                                            )
                                                        })
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            }
                        </div>
                        {
                            loading
                                ? <Button className="w-full mt-8 bg-[#6A38C2]" disabled> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button>
                                : <Button type="submit" className="w-full mt-8 bg-[#6A38C2] hover:bg-[#5b30a6]">Post Job</Button>
                        }
                        {
                            companies.length === 0 && <p className='text-xs text-red-500 font-medium text-center mt-4'>* Please register a company first before posting a job</p>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostJob