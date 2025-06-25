"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { Users, FileText, Contact, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersCount, selectTotalUsersCount } from "@/lib/redux/userSlice";
import { fetchLeadsCount, selectTotalLeadsCount } from "@/lib/redux/leadSlice";
import { AppDispatch } from "@/lib/store";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter(); // 2. Initialize the router
    const totalUsers = useSelector(selectTotalUsersCount);
    const totalLeads = useSelector(selectTotalLeadsCount);

    useEffect(() => {
        dispatch(fetchUsersCount());
        dispatch(fetchLeadsCount());
    }, [dispatch]);

    // 3. Create a handler for the button clicks
    // const handleQuickAction = (action: string) => {
    //     if (action === "Add New User") {
    //         router.push('/dashboard/admin/users');
    //     } else if (action === "Create Lead") {
    //         router.push('/dashboard/admin/leads');
    //     }
    // };
    
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
            value: "456",
            change: "-2.4%",
            icon: Contact,
            trend: "down",
        },
        {
            name: "Conversion Rate",
            value: "24.8%",
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
                        <div className="mt-4">
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
                        </div>
                    </div>
                ))}
            </div>

            {/* <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Quick Actions
                    </h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {[
                            "Add New User",
                            "Create Lead",
                        ].map((action) => (
                            <button
                                key={action}
                                // 4. Add the onClick handler
                                onClick={() => handleQuickAction(action)}
                                className="rounded-lg border bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            </div> */}
        </div>
    );
}