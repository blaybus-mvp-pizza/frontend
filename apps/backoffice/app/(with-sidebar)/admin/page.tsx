import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminCreateButton from "@/components/admin/admin-create-button";
import AdminTable from "@/components/admin/admin-table";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/");
  }

  return (
    <div className='flex-1 p-2'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold'>관리자 목록</h2>
        <AdminCreateButton />
      </div>
      <AdminTable />
    </div>
  );
}
