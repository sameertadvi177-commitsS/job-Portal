import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                                    You haven't applied to any jobs yet.
                                </TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob) => {
                            const status = appliedJob?.status || 'pending';
                            return (
                                <TableRow key={appliedJob._id}>
                                    <TableCell>{appliedJob?.createdAt ? appliedJob.createdAt.split("T")[0] : "NA"}</TableCell>
                                    <TableCell>{appliedJob.job?.title || "NA"}</TableCell>
                                    <TableCell>{appliedJob.job?.company?.name || "NA"}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={`capitalize border px-2.5 py-0.5 rounded-full ${
                                            status === 'accepted' 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                                : status === 'rejected' 
                                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                        }`}>
                                            {status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable