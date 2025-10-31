"use client";

import { useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import SearchBar from "./atoms/tables/SearchBar";
import EntriesPerPage from "./atoms/tables/EntriesPerPage";
import Pagination from "./atoms/tables/Pagination";

interface Employee {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive" | "On Leave";
    joinDate: string;
    location: string;
    avatar: string;
}

// Extended employee data with up to 30 entries
const employeeData: Employee[] = [
    { id: 1, name: "John Doe", email: "john.doe@intellinum.com", role: "Oracle Solutions Architect", status: "Active", joinDate: "2022-01-15", location: "Dallas, TX", avatar: "JD" },
    { id: 2, name: "Jane Smith", email: "jane.smith@intellinum.com", role: "Supply Chain Analyst", status: "Active", joinDate: "2021-06-30", location: "Jakarta, Indonesia", avatar: "JS" },
    { id: 3, name: "Mark Johnson", email: "mark.johnson@intellinum.com", role: "Logistics Manager", status: "On Leave", joinDate: "2022-10-01", location: "Mumbai, India", avatar: "MJ" },
    { id: 4, name: "Sarah Wilson", email: "sarah.wilson@intellinum.com", role: "Oracle Developer", status: "Active", joinDate: "2023-03-15", location: "Dubai, UAE", avatar: "SW" },
    { id: 5, name: "David Chen", email: "david.chen@intellinum.com", role: "Project Manager", status: "Active", joinDate: "2021-11-20", location: "Singapore", avatar: "DC" },
    { id: 6, name: "Emily Rodriguez", email: "emily.rodriguez@intellinum.com", role: "Business Analyst", status: "Inactive", joinDate: "2022-05-08", location: "Dallas, TX", avatar: "ER" },
    { id: 7, name: "Michael Brown", email: "michael.brown@intellinum.com", role: "Oracle Consultant", status: "Active", joinDate: "2023-01-12", location: "Jakarta, Indonesia", avatar: "MB" },
    { id: 8, name: "Lisa Anderson", email: "lisa.anderson@intellinum.com", role: "Supply Chain Director", status: "Active", joinDate: "2020-09-25", location: "Mumbai, India", avatar: "LA" },
    { id: 9, name: "Robert Taylor", email: "robert.taylor@intellinum.com", role: "Oracle Solutions Architect", status: "Active", joinDate: "2022-08-14", location: "Dubai, UAE", avatar: "RT" },
    { id: 10, name: "Jennifer White", email: "jennifer.white@intellinum.com", role: "Supply Chain Analyst", status: "Active", joinDate: "2023-02-28", location: "Singapore", avatar: "JW" },
    { id: 11, name: "Christopher Lee", email: "christopher.lee@intellinum.com", role: "Logistics Manager", status: "Active", joinDate: "2021-12-10", location: "Dallas, TX", avatar: "CL" },
    { id: 12, name: "Amanda Davis", email: "amanda.davis@intellinum.com", role: "Oracle Developer", status: "On Leave", joinDate: "2022-06-18", location: "Jakarta, Indonesia", avatar: "AD" },
    { id: 13, name: "James Martinez", email: "james.martinez@intellinum.com", role: "Project Manager", status: "Active", joinDate: "2023-01-05", location: "Mumbai, India", avatar: "JM" },
    { id: 14, name: "Patricia Garcia", email: "patricia.garcia@intellinum.com", role: "Business Analyst", status: "Active", joinDate: "2022-09-22", location: "Dubai, UAE", avatar: "PG" },
    { id: 15, name: "Daniel Wilson", email: "daniel.wilson@intellinum.com", role: "Oracle Consultant", status: "Active", joinDate: "2021-07-14", location: "Singapore", avatar: "DW" },
    { id: 16, name: "Michelle Thompson", email: "michelle.thompson@intellinum.com", role: "Supply Chain Director", status: "Inactive", joinDate: "2020-11-08", location: "Dallas, TX", avatar: "MT" },
    { id: 17, name: "Kevin Moore", email: "kevin.moore@intellinum.com", role: "Oracle Solutions Architect", status: "Active", joinDate: "2022-04-12", location: "Jakarta, Indonesia", avatar: "KM" },
    { id: 18, name: "Stephanie Jackson", email: "stephanie.jackson@intellinum.com", role: "Supply Chain Analyst", status: "Active", joinDate: "2023-06-30", location: "Mumbai, India", avatar: "SJ" },
    { id: 19, name: "Ryan Miller", email: "ryan.miller@intellinum.com", role: "Logistics Manager", status: "Active", joinDate: "2021-10-25", location: "Dubai, UAE", avatar: "RM" },
    { id: 20, name: "Nicole Brown", email: "nicole.brown@intellinum.com", role: "Oracle Developer", status: "On Leave", joinDate: "2022-12-15", location: "Singapore", avatar: "NB" },
    { id: 21, name: "Andrew Clark", email: "andrew.clark@intellinum.com", role: "Project Manager", status: "Active", joinDate: "2023-03-08", location: "Dallas, TX", avatar: "AC" },
    { id: 22, name: "Rachel Lewis", email: "rachel.lewis@intellinum.com", role: "Business Analyst", status: "Active", joinDate: "2022-01-20", location: "Jakarta, Indonesia", avatar: "RL" },
    { id: 23, name: "Gregory Walker", email: "gregory.walker@intellinum.com", role: "Oracle Consultant", status: "Active", joinDate: "2021-05-17", location: "Mumbai, India", avatar: "GW" },
    { id: 24, name: "Laura Hall", email: "laura.hall@intellinum.com", role: "Supply Chain Director", status: "Inactive", joinDate: "2020-08-12", location: "Dubai, UAE", avatar: "LH" },
    { id: 25, name: "Benjamin Allen", email: "benjamin.allen@intellinum.com", role: "Oracle Solutions Architect", status: "Active", joinDate: "2022-11-03", location: "Singapore", avatar: "BA" },
    { id: 26, name: "Melissa Young", email: "melissa.young@intellinum.com", role: "Supply Chain Analyst", status: "Active", joinDate: "2023-05-15", location: "Dallas, TX", avatar: "MY" },
    { id: 27, name: "Jonathan King", email: "jonathan.king@intellinum.com", role: "Logistics Manager", status: "Active", joinDate: "2021-09-28", location: "Jakarta, Indonesia", avatar: "JK" },
    { id: 28, name: "Jessica Wright", email: "jessica.wright@intellinum.com", role: "Oracle Developer", status: "On Leave", joinDate: "2022-07-19", location: "Mumbai, India", avatar: "JWR" },
    { id: 29, name: "Matthew Lopez", email: "matthew.lopez@intellinum.com", role: "Project Manager", status: "Active", joinDate: "2023-04-22", location: "Dubai, UAE", avatar: "ML" },
    { id: 30, name: "Ashley Hill", email: "ashley.hill@intellinum.com", role: "Business Analyst", status: "Active", joinDate: "2022-02-14", location: "Singapore", avatar: "AH" },
];

export default function DataTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<keyof Employee>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // Filter data based on search term
    const filteredData = employeeData.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortDirection === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (field: keyof Employee) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const getStatusColor = (status: Employee["status"]) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            case "Inactive":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
            case "On Leave":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    const getRoleColor = (role: string) => {
        if (role.includes("Oracle")) return "bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300";
        if (role.includes("Supply Chain") || role.includes("Logistics")) return "bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300";
        return "bg-tertiary-100 text-tertiary-800 dark:bg-tertiary-900/20 dark:text-tertiary-300";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card overflow-hidden mx-4 sm:mx-6 lg:mx-8"
        >
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/10 dark:border-gray-700/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="mb-4 sm:mb-0">
                        <h3 className="text-2xl font-secondary font-bold text-gray-900 dark:text-white mb-2">
                            Intellinum Team Directory
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Global team across Dallas, Indonesia, India, Dubai, and Singapore
                        </p>
                    </div>

                    {/* Search and Controls using reusable components */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search team members..."
                        />
                    </div>
                </div>
            </div>

            {/* Table with horizontal scrolling enabled for small screens */}
            <div className="overflow-x-auto custom-scrollbar w-full">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50">
                        <tr>
                            <th
                                className="px-7 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-200/30 dark:hover:bg-gray-600/30 transition-colors"
                                onClick={() => handleSort("name")}
                            >
                                <div className="flex items-center space-x-2">
                                    <span>Name</span>
                                    {sortField === "name" && (
                                        <span className="text-primary-500 font-bold">
                                            {sortDirection === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Role
                            </th>
                            <th
                                className="px-8 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-200/30 dark:hover:bg-gray-600/30 transition-colors"
                                onClick={() => handleSort("location")}
                            >
                                <div className="flex items-center space-x-2">
                                    <span>Location</span>
                                    {sortField === "location" && (
                                        <span className="text-primary-500 font-bold">
                                            {sortDirection === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Join Date
                            </th>
                            <th className="px-8 py-5 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
                        {currentData.map((employee, index) => (
                            <motion.tr
                                key={employee.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-all duration-200"
                            >
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="ml-6">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white font-tertiary mb-1">
                                                {employee.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {employee.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <span className={`inline-flex px-4 py-2 text-xs font-semibold rounded-full ${getRoleColor(employee.role)}`}>
                                        {employee.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {employee.location}
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <span className={`inline-flex px-4 py-2 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                                        {employee.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {new Date(employee.joinDate).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-3">
                                        <motion.button
                                            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <EyeIcon className="w-6 h-6" />
                                        </motion.button>
                                        <motion.button
                                            className="text-secondary-600 hover:text-secondary-500 dark:text-secondary-400 p-2 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <PencilIcon className="w-6 h-6" />
                                        </motion.button>
                                        <motion.button
                                            className="text-tertiary-600 hover:text-tertiary-500 dark:text-tertiary-400 p-2 hover:bg-tertiary-50 dark:hover:bg-tertiary-900/20 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <TrashIcon className="w-6 h-6" />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination with centered layout and separator */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-8 px-8 py-6 border-t border-white/10 dark:border-gray-700/30">
                <EntriesPerPage
                    value={itemsPerPage}
                    onChange={setItemsPerPage}
                    options={[5, 10, 15, 20, 25, 30]}
                />

                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div> {/* Vertical separator */}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    showInfo={true}
                    totalItems={sortedData.length}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </motion.div>
    );
}
