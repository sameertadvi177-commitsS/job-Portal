import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    return (
        <div className='p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200'>
            <div className='flex items-center justify-between'>
                <p className='text-xs text-gray-400'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full h-8 w-8" size="icon"><Bookmark className='w-4 h-4' /></Button>
            </div>

            <div className='flex items-center gap-3 my-3'>
                <Avatar className='h-10 w-10'>
                    <AvatarImage src={job?.company?.logo} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold text-xs">
                        {job?.company?.name ? job.company.name.substring(0, 2).toUpperCase() : "CO"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='font-medium text-sm text-gray-900'>{job?.company?.name}</h1>
                    <p className='text-xs text-gray-400'>{job?.location || "India"}</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-md text-gray-800 my-1'>{job?.title}</h1>
                <p className='text-xs text-gray-500 line-clamp-2'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4 flex-wrap'>
                <Badge className='text-blue-700 font-medium bg-blue-50 border-blue-200' variant="outline">{job?.position} Positions</Badge>
                <Badge className='text-[#F83002] font-medium bg-orange-50 border-orange-200' variant="outline">{job?.jobType}</Badge>
                <Badge className='text-[#7209b7] font-medium bg-purple-50 border-purple-200' variant="outline">{job?.salary} LPA</Badge>
            </div>
            <div className='flex items-center gap-3 mt-4'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className='text-sm'>Details</Button>
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-sm">Save For Later</Button>
            </div>
        </div>
    )
}

export default Job