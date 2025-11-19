'use client'

import { useEffect, useState } from "react"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"

import { DataTable } from "@/components/data-table"

import { SectionCards } from "@/components/section-cards"

import { useAuth } from "@/utils/context/AuthContext"

import { Skeleton } from "@/components/ui/skeleton"

import allData from "./data.json"

function AdminDashboard() {
    return (
        <>
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={allData} />
        </>
    )
}

function PemilikDashboard({ name }: { name: string }) {
    const filtered = allData.filter(row => row.reviewer === name);
    return (
        <>
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={filtered} />
        </>
    )
}

export default function Page() {
    const { user } = useAuth();
    const [role, setRole] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    useEffect(() => {
        if (user) { setRole(user.role); setName(user.name); }
    }, [user]);

    if (role === "admin") {
        return <AdminDashboard />;
    } else if (role === "pemilik" && name) {
        return <PemilikDashboard name={name} />;
    } else {
        return <Skeleton className="w-full h-full" />;
    }
}
