"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { columns } from "@/components/admin/columns";
import { DataTable } from "@/components/admin/data-table";
import { Admin } from "@/generated/prisma";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function AdminTable() {
  const { data: admins, isLoading } = useQuery<Admin[]>({
    queryKey: ["admins"],
    queryFn: async () => {
      const response = await axios.get("/api/admin");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-[400px] w-full' />
      </div>
    );
  }

  return (
    <>
      <DataTable columns={columns} data={admins || []} />
    </>
  );
}
