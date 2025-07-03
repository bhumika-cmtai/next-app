"use client"
// NEW: Import useState
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, Contact, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersCount, selectTotalUsersCount,fetchTotalIncome, selectTotalIncome} from "@/lib/redux/userSlice";
import { fetchLeadsCount, selectTotalLeadsCount } from "@/lib/redux/leadSlice";
// NEW: Import the thunk to get the registrations count
import { getRegisterationsCount } from "@/lib/redux/registerationSlice";
import { AppDispatch } from "@/lib/store";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const totalUsers = useSelector(selectTotalUsersCount);
    const totalLeads = useSelector(selectTotalLeadsCount);
    const totalIncome = useSelector(selectTotalIncome); 
    // NEW: State to store the registrations count
    const [registrationsCount, setRegistrationsCount] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchUsersCount());
        dispatch(fetchLeadsCount());
        dispatch(fetchTotalIncome()); 
        // NEW: Create an async function to fetch the count and update the state
        const fetchRegistrations = async () => {
            const count = await dispatch(getRegisterationsCount());
            if (count !== null) {
                setRegistrationsCount(count);
            }
        };

        // Call the new function
        fetchRegistrations();

    }, [dispatch]);
    
    const stats = [
        {
            name: "Total Leaders",
            value: (totalUsers ?? 0).toLocaleString(),
            change: "+12.5%",
            icon: Users,
            trend: "up",
        },
        {
            name: "Total Leads",
            value: (totalLeads ?? 0).toLocaleString(),
            change: "+8.2%",
            icon: FileText,
            trend: "up",
        },
        {
            name: "Employee Income",
            value: (totalIncome ?? 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
            change: "-2.4%",
            icon: Contact,
            trend: "down",
        },
        {
            name: "Total Registrations",
            // NEW: Use the state variable to display the count. Shows '...' while loading.
            value: registrationsCount !== null ? registrationsCount.toLocaleString() : '...',
            change: "+4.1%",
            icon: TrendingUp,
            trend: "up",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="rounded-lg border bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                                <p className="mt-2 text-3xl font-semibold text-slate-900">
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                className={`rounded-full p-3 ${
                                    stat.trend === "up"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                }`}
                            >
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                        {/* <div className="mt-4">
                            <span
                                className={`text-sm font-medium ${
                                    stat.trend === "up"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {stat.change}
                            </span>
                            <span className="text-sm text-slate-600"> from last month</span>
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
}