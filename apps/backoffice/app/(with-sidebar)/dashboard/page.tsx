import DashboardStats from "@/components/dashboard/dashboard-stats";

export default function DashboardPage() {
  return (
    <div className='flex-1 p-2'>
      <h2 className='text-2xl font-bold mb-4'>대시보드</h2>
      <DashboardStats />
    </div>
  );
}
