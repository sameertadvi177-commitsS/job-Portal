import React, { useState } from 'react'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, resetFilters } from '@/redux/jobSlice'
import { X } from 'lucide-react'

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

    const [selectedLocation, setSelectedLocation] = useState(filters.location || "");
    const [selectedIndustry, setSelectedIndustry] = useState(filters.keyword || "");
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [selectedJobType, setSelectedJobType] = useState(filters.jobType || "");
    const [selectedExperience, setSelectedExperience] = useState(null);

    const applyLocationFilter = (loc) => {
        const newLoc = selectedLocation === loc ? "" : loc;
        setSelectedLocation(newLoc);
        dispatch(setFilters({ location: newLoc, page: 1 }));
    };

    const applyIndustryFilter = (ind) => {
        const newInd = selectedIndustry === ind ? "" : ind;
        setSelectedIndustry(newInd);
        dispatch(setFilters({ keyword: newInd, page: 1 }));
    };

    const applySalaryFilter = (range) => {
        if (selectedSalary?.label === range.label) {
            setSelectedSalary(null);
            dispatch(setFilters({ salaryMin: 0, salaryMax: 0, page: 1 }));
        } else {
            setSelectedSalary(range);
            dispatch(setFilters({ salaryMin: range.min, salaryMax: range.max, page: 1 }));
        }
    };

    const applyJobTypeFilter = (type) => {
        const newType = selectedJobType === type ? "" : type;
        setSelectedJobType(newType);
        dispatch(setFilters({ jobType: newType, page: 1 }));
    };

    const applyExperienceFilter = (exp) => {
        if (selectedExperience?.value === exp.value) {
            setSelectedExperience(null);
            dispatch(setFilters({ experience: 0, page: 1 }));
        } else {
            setSelectedExperience(exp);
            dispatch(setFilters({ experience: exp.value, page: 1 }));
        }
    };

    const clearAllFilters = () => {
        setSelectedLocation("");
        setSelectedIndustry("");
        setSelectedSalary(null);
        setSelectedJobType("");
        setSelectedExperience(null);
        dispatch(resetFilters());
    };

    const hasActiveFilters = selectedLocation || selectedIndustry || selectedSalary || selectedJobType || selectedExperience;

    return (
        <div className='w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between mb-3'>
                <h1 className='font-bold text-lg'>Filters</h1>
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

            {/* Location Filter */}
            <div className='mb-5'>
                <h2 className='font-semibold text-sm text-gray-700 mb-2'>📍 Location</h2>
                <div className='flex flex-wrap gap-1.5'>
                    {locationOptions.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => applyLocationFilter(loc)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 ${
                                selectedLocation === loc
                                    ? 'bg-[#6A38C2] text-white border-[#6A38C2]'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#6A38C2] hover:text-[#6A38C2]'
                            }`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>

            {/* Industry Filter */}
            <div className='mb-5'>
                <h2 className='font-semibold text-sm text-gray-700 mb-2'>💼 Industry</h2>
                <div className='flex flex-col gap-1.5'>
                    {industryOptions.map((ind) => (
                        <label key={ind} className='flex items-center gap-2 cursor-pointer group'>
                            <input
                                type="checkbox"
                                checked={selectedIndustry === ind}
                                onChange={() => applyIndustryFilter(ind)}
                                className='w-3.5 h-3.5 rounded accent-[#6A38C2]'
                            />
                            <span className={`text-sm transition-colors ${
                                selectedIndustry === ind ? 'text-[#6A38C2] font-medium' : 'text-gray-600 group-hover:text-gray-800'
                            }`}>
                                {ind}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Job Type Filter */}
            <div className='mb-5'>
                <h2 className='font-semibold text-sm text-gray-700 mb-2'>📋 Job Type</h2>
                <div className='flex flex-wrap gap-1.5'>
                    {jobTypeOptions.map((type) => (
                        <button
                            key={type}
                            onClick={() => applyJobTypeFilter(type)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 ${
                                selectedJobType === type
                                    ? 'bg-[#F83002] text-white border-[#F83002]'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#F83002] hover:text-[#F83002]'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Salary Range Filter */}
            <div className='mb-5'>
                <h2 className='font-semibold text-sm text-gray-700 mb-2'>💰 Salary</h2>
                <div className='flex flex-col gap-1.5'>
                    {salaryRanges.map((range) => (
                        <label key={range.label} className='flex items-center gap-2 cursor-pointer group'>
                            <input
                                type="radio"
                                name="salary"
                                checked={selectedSalary?.label === range.label}
                                onChange={() => applySalaryFilter(range)}
                                className='w-3.5 h-3.5 accent-[#6A38C2]'
                            />
                            <span className={`text-sm transition-colors ${
                                selectedSalary?.label === range.label ? 'text-[#6A38C2] font-medium' : 'text-gray-600 group-hover:text-gray-800'
                            }`}>
                                {range.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Experience Filter */}
            <div className='mb-3'>
                <h2 className='font-semibold text-sm text-gray-700 mb-2'>⭐ Experience</h2>
                <div className='flex flex-col gap-1.5'>
                    {experienceOptions.map((exp) => (
                        <label key={exp.label} className='flex items-center gap-2 cursor-pointer group'>
                            <input
                                type="radio"
                                name="experience"
                                checked={selectedExperience?.value === exp.value}
                                onChange={() => applyExperienceFilter(exp)}
                                className='w-3.5 h-3.5 accent-[#6A38C2]'
                            />
                            <span className={`text-sm transition-colors ${
                                selectedExperience?.value === exp.value ? 'text-[#6A38C2] font-medium' : 'text-gray-600 group-hover:text-gray-800'
                            }`}>
                                {exp.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FilterCard