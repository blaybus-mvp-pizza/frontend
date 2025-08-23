import { FormLabel } from '@workspace/ui/components/form'

type FormLabelWithStatusProps = {
  label: string
  required?: boolean
  isError?: boolean
}

export default function FormLabelWithStatus({
  label,
  required = false,
  isError = false,
}: FormLabelWithStatusProps) {
  const statusColor = isError ? 'text-red-500' : required ? 'text-[#2FC9B4]' : 'text-[#767676]'

  return (
    <FormLabel className="flex gap-[2px]">
      <span className="text-sm font-medium">{label}</span>
      {required ? (
        <span className={`text-sm font-medium ${statusColor}`}>(필수)</span>
      ) : (
        <span className={`text-sm font-medium ${statusColor}`}>(선택)</span>
      )}
    </FormLabel>
  )
}
