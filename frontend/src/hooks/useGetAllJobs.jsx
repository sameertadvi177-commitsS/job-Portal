import { setAllJobs, setPagination, setJobsLoading } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector(store => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                dispatch(setJobsLoading(true));

                // Build query params from filters
                const params = new URLSearchParams();
                if (filters.keyword) params.append('keyword', filters.keyword);
                if (filters.location) params.append('location', filters.location);
                if (filters.jobType) params.append('jobType', filters.jobType);
                if (filters.salaryMin > 0) params.append('salaryMin', filters.salaryMin);
                if (filters.salaryMax > 0) params.append('salaryMax', filters.salaryMax);
                if (filters.experience > 0) params.append('experience', filters.experience);
                if (filters.sortBy) params.append('sortBy', filters.sortBy);
                if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
                if (filters.page) params.append('page', filters.page);

                const res = await axios.get(
                    `${JOB_API_END_POINT}/get?${params.toString()}`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                    if (res.data.pagination) {
                        dispatch(setPagination(res.data.pagination));
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setJobsLoading(false));
            }
        }
        fetchAllJobs();
    }, [filters, dispatch]);
}

export default useGetAllJobs