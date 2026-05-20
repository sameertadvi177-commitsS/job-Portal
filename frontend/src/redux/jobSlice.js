import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        // Enhanced filter state
        filters: {
            keyword: "",
            location: "",
            jobType: "",
            salaryMin: 0,
            salaryMax: 0,
            experience: 0,
            sortBy: "createdAt",
            sortOrder: "desc",
            page: 1,
        },
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalJobs: 0,
            limit: 12,
            hasNextPage: false,
            hasPrevPage: false,
        },
        jobsLoading: false,
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = {
                keyword: "",
                location: "",
                jobType: "",
                salaryMin: 0,
                salaryMax: 0,
                experience: 0,
                sortBy: "createdAt",
                sortOrder: "desc",
                page: 1,
            };
        },
        setPagination: (state, action) => {
            state.pagination = action.payload;
        },
        setJobsLoading: (state, action) => {
            state.jobsLoading = action.payload;
        },
    }
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setFilters,
    resetFilters,
    setPagination,
    setJobsLoading,
} = jobSlice.actions;
export default jobSlice.reducer;