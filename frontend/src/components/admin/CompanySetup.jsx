import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null
        })
    }, [singleCompany]);

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-2xl mx-auto my-10 px-4'>
                <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8'>
                    {/* Header */}
                    <div className='flex items-center gap-4 mb-8'>
                        <Button onClick={() => navigate("/admin/companies")} variant="outline" size="icon" className="rounded-full h-9 w-9">
                            <ArrowLeft className='w-4 h-4' />
                        </Button>
                        <h1 className='font-bold text-xl text-gray-900'>Company Setup</h1>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Company Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                    className='mt-1'
                                />
                            </div>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    className='mt-1'
                                />
                            </div>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Website</Label>
                                <Input
                                    type="text"
                                    name="website"
                                    value={input.website}
                                    onChange={changeEventHandler}
                                    placeholder="https://example.com"
                                    className='mt-1'
                                />
                            </div>
                            <div>
                                <Label className='text-sm font-medium text-gray-700'>Location</Label>
                                <Input
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    className='mt-1'
                                />
                            </div>
                            <div className='md:col-span-2'>
                                <Label className='text-sm font-medium text-gray-700'>Logo</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={changeFileHandler}
                                    className='mt-1'
                                />
                            </div>
                        </div>
                        {
                            loading
                                ? <Button className="w-full mt-8 bg-[#6A38C2]" disabled> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button>
                                : <Button type="submit" className="w-full mt-8 bg-[#6A38C2] hover:bg-[#5b30a6]">Update Company</Button>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanySetup