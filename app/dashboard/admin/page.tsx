import React from "react";
import { Users, FileText, Contact, TrendingUp } from "lucide-react";

const stats = [
    {
        name: "Total Users",
        value: "2,543",
        change: "+12.5%",
        icon: Users,
        trend: "up",
    },
    {
        name: "Active Leads",
        value: "1,234",
        change: "+8.2%",
        icon: FileText,
        trend: "up",
    },
    {
        name: "New Contacts",
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

export default function Dashboard() {
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

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Recent Activity
                    </h2>
                    <div className="mt-4 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-purple-100" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        User Activity {i}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Description of activity {i}
                                    </p>
                                </div>
                                <div className="ml-auto text-sm text-slate-600">2h ago</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Quick Actions
                    </h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {[
                            "Add New User",
                            "Create Lead",
                            "Import Contacts",
                            "Generate Report",
                        ].map((action) => (
                            <button
                                key={action}
                                className="rounded-lg border bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
