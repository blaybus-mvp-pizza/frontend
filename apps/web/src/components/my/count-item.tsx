export default function CountItem({
  className,
  label,
  count,
}: {
  className?: string;
  label: string;
  count: number;
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 items-center justify-center bg-white px-6 py-4 ${className}`}
    >
      <div className='font-medium text-gray-500 text-xs sm:text-sm whitespace-nowrap'>
        {label}
      </div>
      <div className='flex items-center font-semibold text-black gap-1 mb-0.5'>
        <span className='text-xl'>{count}</span>
        <span className='text-lg'>건</span>
      </div>
    </div>
  );
}
