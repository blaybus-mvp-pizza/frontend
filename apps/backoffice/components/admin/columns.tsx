"use client";

import { Admin } from "@/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Crown } from "lucide-react";
import AdminDeleteButton from "./admin-delete-button";

export const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: "nickname",
    header: "아이디",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className='flex items-center gap-2 justify-center'>
          <Avatar className='border'>
            <AvatarFallback>{admin.nickname.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className='text-sm font-medium'>{admin.nickname}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "역할",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className='flex items-center gap-1 justify-center'>
          {admin.role === "SUPERADMIN" ? (
            <div className='flex items-center gap-1'>
              <span className='text-sm'>최고 관리자</span>
              <Crown className='w-4 h-4' />
            </div>
          ) : (
            <span className='text-sm'>일반 관리자</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "삭제",
    cell: ({ row }) => {
      const admin = row.original;
      return <AdminDeleteButton id={admin.id} />;
    },
  },
];
