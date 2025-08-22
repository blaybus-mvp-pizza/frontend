import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <Card className='w-full gap-3'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardCardSkeleton() {
  return (
    <Card className='w-full gap-3'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='text-sm font-medium'>
          <Skeleton className='h-4 w-32' />
        </CardTitle>
        <Skeleton className='h-4 w-4 rounded-full' />
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        <div className='text-2xl font-bold'>
          <Skeleton className='h-8 w-24' />
        </div>
        <div className='text-xs text-muted-foreground'>
          <Skeleton className='h-3 w-48' />
        </div>
      </CardContent>
    </Card>
  );
}
