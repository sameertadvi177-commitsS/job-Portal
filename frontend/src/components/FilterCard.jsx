import React from 'react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, resetFilters } from '@/redux/jobSlice'
import { X, Check } from 'lucide-react'

const locationOptions = ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Ahmedabad", "Jaipur", "Gurgaon", "Jodhpur", "Delhi", "Remote"];
const industryOptions = ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science", "Graphic Designer", "Artificial Intelligence", "Ethical Hacking"];
const salaryRanges = [
    { label: "0 - 5 LPA", min: 0, max: 5 },
    { label: "5 - 10 LPA", min: 5, max: 10 },
    { label: "10 - 15 LPA", min: 10, max: 15 },
    { label: "15 - 20 LPA", min: 15, max: 20 },
    { label: "20+ LPA", min: 20, max: 0 },
];
const jobTypeOptions = ["Full-time", "Part-time", "Internship", "Contract", "Freelance"];
const experienceOptions = [
    { label: "Fresher (0 yrs)", value: 0 },
    { label: "1-2 years", value: 2 },
    { label: "3-5 years", value: 5 },
    { label: "5-10 years", value: 10 },
    { label: "10+ years", value: 15 },
];

const FilterCard = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector(store => store.job);

    // Multi-select helpers
    const toggleArrayFilter = (key, value) => {
        const current = filters[key] || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        dispatch(setFilters({ [key]: updated, page: 1 }));
    };

    const isSelected = (key, value) => {
        const current = filters[key] || [];
        return current.includes(value);
    };

    // Salary filter (single-select radio)
    const applySalaryFilter = (range) => {
        if (filters.salaryMin === range.min && filters.salaryMax === range.max) {
            dispatch(setFilters({ salaryMin: 0, salaryMax: 0, page: 1 }));
        } else {
            dispatch(setFilters({ salaryMin: range.min, salaryMax: range.max, page: 1 }));
        }
    };

    const isSalarySelected = (range) => filters.salaryMin === range.min && filters.salaryMax === range.max;

    // Experience filter (single-select radio)
    const applyExperienceFilter = (exp) => {
        if (filters.experience === exp.value) {
            dispatch(setFilters({ experience: 0, page: 1 }));
        } else {
            dispatch(setFilters({ experience: exp.value, page: 1 }));
        }
    };

    const clearAllFilters = () => {
        dispatch(resetFilters());
    };

    const hasActiveFilters =
        (filters.location && filters.location.length > 0) ||
        (filters.industry && filters.industry.length > 0) ||
        (filters.jobType && filters.jobType.length > 0) ||
        filters.salaryMin > 0 || filters.salaryMax > 0 ||
        filters.experience > 0;

    // Count active filters
    const activeCount =
        (filters.location?.length || 0) +
        (filters.industry?.length || 0) +
        (filters.jobType?.length || 0) +
        (filters.salaryMin > 0 || filters.salaryMax > 0 ? 1 : 0) +
        (filters.experience > 0 ? 1 : 0);

    return (
        <div className='w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                    <h1 className='font-bold text-lg'>Filters</h1>
                    {activeCount > 0 && (
                        <span className='bg-[#6A38C2] text-white text-xs px-2 py-0.5 rounded-full font-medium'>
                            {activeCount}
                        </span>
                    )}
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                    >
                        <X className='w-3 h-3 mr-1' />
                        Clear All
                    </Button>
                )}
            </div>
            <hr className='mb-4' />

            {/* Location Filter — Multi-Select Checkboxes */}
            <div className='mb-5'>
                <h2 className='font-semibold text-sm text-gray-700 mb-2'>📍 Location</h2>
                <div className='flex flex-col gap-1.5'>
                    {locationOptions.map((loc) => (
                        <label key={loc} className='flex items-center gap-2 cursor-pointer group'>
                            <input
                                type="checkbox"
                                checked={isSelected('location', loc)}
                                onChange={() => toggleArrayFilter('location', loc)}
                                className='w-3.5 h-3.5 rounded accent-[#6A38C2]'
                            />
                            <span className={`text-sm transition-colors ${
                                isSelected('location', loc) ? 'text-[#6A38C2] font-medium' : 'text-gray-600 group-hover:text-gray-800'
                            }`}>
                                {loc}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Industry Filter — Multi-Select Checkboxes */}
            <div className='mb-5'>
                <h2 className='font-semibold text-sm text-gray-700 mb-2'>💼 Industry</h2>
                <div className='flex flex-col gap-1.5'>
                    {industryOptions.map((ind) => (
                        <label key={ind} className='flex items-center gap-2 cursor-pointer group'>
                            <input
                                type="checkbox"
                                checked={isSelected('industry', ind)}
                                onChange={() => toggleArrayFilter('industry', ind)}
                                className='w-3.5 h-3.5 rounded accent-[#6A38C2]'
                            />
                            <span className={`text-sm transition-colors ${
                                isSelected('industry', ind) ? 'text-[#6A38C2] font-medium' : 'text-gray-600 group-hover:text-gray-800'
                            }`}>
                                {ind}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Job Type Filter — Multi-Select Checkboxes */}
            <div className='mb-5'>
                <h2 className='font-semibold text-sm text-gray-700 mb-2'>📋 Job Type</h2>
                <div className='flex flex-col gap-1.5'>
                    {jobTypeOptions.map((type) => (
                        <label key={type} className='flex items-center gap-2 cursor-pointer group'>
                            <input
                                type="checkbox"
                                checked={isSelected('jobType', type)}
                                onChange={() => toggleArrayFilter('jobType', type)}
                                className='w-3.5 h-3.5 rounded accent-[#6A38C2]'
                            />
                            <span className={`text-sm transition-colors ${
                                isSelected('jobType', type) ? 'text-[#6A38C2] font-medium' : 'text-gray-600 group-hover:text-gray-800'
                            }`}>
                                {type}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Salary Range Filter — Single-Select Radio */}
            <div className='mb-5'>
                <h2 className='font-semibold text-sm text-gray-700 mb-2'>💰 Salary</h2>
                <div className='flex flex-col gap-1.5'>
                    {salaryRanges.map((range) => (
                        <label key={range.label} className='flex items-center gap-2 cursor-pointer group'>
                            <input
                                type="radio"
                                name="salary"
                                checked={isSalarySelected(range)}
                                onChange={() => applySalaryFilter(range)}
                                className='w-3.5 h-3.5 accent-[#6A38C2]'
                            />
                            <span className={`text-sm transition-colors ${
                                isSalarySelected(range) ? 'text-[#6A38C2] font-medium' : 'text-gray-600 group-hover:text-gray-800'
                            }`}>
                                {range.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Experience Filter — Single-Select Radio */}
            <div className='mb-3'>
                <h2 className='font-semibold text-sm text-gray-700 mb-2'>⭐ Experience</h2>
                <div className='flex flex-col gap-1.5'>
                    {experienceOptions.map((exp) => (
                        <label key={exp.label} className='flex items-center gap-2 cursor-pointer group'>
                            <input
                                type="radio"
                                name="experience"
                                checked={filters.experience === exp.value && exp.value > 0}
                                onChange={() => applyExperienceFilter(exp)}
                                className='w-3.5 h-3.5 accent-[#6A38C2]'
                            />
                            <span className={`text-sm transition-colors ${
                                filters.experience === exp.value && exp.value > 0 ? 'text-[#6A38C2] font-medium' : 'text-gray-600 group-hover:text-gray-800'
                            }`}>
                                {exp.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className='mt-4 pt-4 border-t border-gray-100'>
                    <h3 className='text-xs font-semibold text-gray-500 mb-2'>ACTIVE FILTERS</h3>
                    <div className='flex flex-wrap gap-1.5'>
                        {filters.location?.map(loc => (
                            <span key={loc} className='inline-flex items-center gap-1 text-xs bg-purple-50 text-[#6A38C2] px-2 py-1 rounded-full'>
                                {loc}
                                <X className='w-3 h-3 cursor-pointer hover:text-red-500' onClick={() => toggleArrayFilter('location', loc)} />
                            </span>
                        ))}
                        {filters.industry?.map(ind => (
                            <span key={ind} className='inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full'>
                                {ind}
                                <X className='w-3 h-3 cursor-pointer hover:text-red-500' onClick={() => toggleArrayFilter('industry', ind)} />
                            </span>
                        ))}
                        {filters.jobType?.map(type => (
                            <span key={type} className='inline-flex items-center gap-1 text-xs bg-orange-50 text-[#F83002] px-2 py-1 rounded-full'>
                                {type}
                                <X className='w-3 h-3 cursor-pointer hover:text-red-500' onClick={() => toggleArrayFilter('jobType', type)} />
                            </span>
                        ))}
                        {(filters.salaryMin > 0 || filters.salaryMax > 0) && (
                            <span className='inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full'>
                                {filters.salaryMax > 0 ? `${filters.salaryMin}-${filters.salaryMax} LPA` : `${filters.salaryMin}+ LPA`}
                                <X className='w-3 h-3 cursor-pointer hover:text-red-500' onClick={() => dispatch(setFilters({ salaryMin: 0, salaryMax: 0, page: 1 }))} />
                            </span>
                        )}
                        {filters.experience > 0 && (
                            <span className='inline-flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full'>
                                ≤{filters.experience} yrs exp
                                <X className='w-3 h-3 cursor-pointer hover:text-red-500' onClick={() => dispatch(setFilters({ experience: 0, page: 1 }))} />
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FilterCard