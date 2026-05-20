import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className='p-5 rounded-xl shadow-sm bg-white border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200'
        >
            <div>
                <h1 className='font-semibold text-lg text-gray-900'>{job?.company?.name}</h1>
                <p className='text-sm text-gray-500'>{job?.location || "India"}</p>
            </div>
            <div className='mt-3'>
                <h2 className='font-bold text-md text-gray-800'>{job?.title}</h2>
                <p className='text-sm text-gray-500 line-clamp-2 mt-1'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4 flex-wrap'>
                <Badge className='text-blue-700 font-medium bg-blue-50 border-blue-200' variant="outline">{job?.position} Positions</Badge>
                <Badge className='text-[#F83002] font-medium bg-orange-50 border-orange-200' variant="outline">{job?.jobType}</Badge>
                <Badge className='text-[#7209b7] font-medium bg-purple-50 border-purple-200' variant="outline">{job?.salary} LPA</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards