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

                // Keyword — combine search keyword + industry selections with pipe for OR matching
                const keywordParts = [];
                if (filters.keyword) keywordParts.push(filters.keyword);
                if (filters.industry && filters.industry.length > 0) {
                    keywordParts.push(...filters.industry);
                }
                if (keywordParts.length > 0) params.append('keyword', keywordParts.join("|"));

                // Location — send as comma-separated for multi-select
                if (filters.location && filters.location.length > 0) {
                    params.append('location', filters.location.join(","));
                }

                // Job Type — send as comma-separated for multi-select
                if (filters.jobType && filters.jobType.length > 0) {
                    params.append('jobType', filters.jobType.join(","));
                }

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