import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='text-center'>
                <h1 className='text-8xl font-bold text-[#6A38C2] mb-4'>404</h1>
                <h2 className='text-2xl font-semibold text-gray-700 mb-2'>Page Not Found</h2>
                <p className='text-gray-500 mb-8 max-w-md'>The page you're looking for doesn't exist or has been moved.</p>
                <Button
                    onClick={() => navigate('/')}
                    className='bg-[#6A38C2] hover:bg-[#5b30a6] flex items-center gap-2 mx-auto'
                >
                    <Home className='w-4 h-4' />
                    Back to Home
                </Button>
            </div>
        </div>
    )
}

export default NotFound
