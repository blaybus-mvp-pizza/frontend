import { Control } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormMessage } from '@workspace/ui/components/form'

import FormLabelWithStatus from './FormLabelWithStatus'

type TextInputFieldProps = {
  control: Control<any>
  name: string
  label: string
  placeholder: string
  type?: string
  required?: boolean
  description?: string
}

export default function TextInputField({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  description,
}: TextInputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-col items-start">
          <FormLabelWithStatus label={label} required={required} isError={!!fieldState.error} />
          <FormControl>
            <input
              type={type}
              placeholder={placeholder}
              {...field}
              className={`h-[48px] w-full rounded-none px-4 py-2 text-sm font-medium shadow-none outline-none focus:border-black focus:ring-0 ${
                fieldState.error ? 'border border-red-500' : 'border border-[#E5E5EC]'
              }`}
              onChange={(e) => {
                if (name === 'phone') {
                  const rawValue = e.target.value.replace(/[^0-9]/g, '')
                  let formattedValue = ''

                  if (rawValue.length > 3 && rawValue.length <= 7) {
                    formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`
                  } else if (rawValue.length > 7) {
                    formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(
                      3,
                      7,
                    )}-${rawValue.slice(7, 11)}`
                  } else {
                    formattedValue = rawValue
                  }

                  field.onChange(formattedValue)
                } else {
                  field.onChange(e)
                }
              }}
            />
          </FormControl>
          {description && (
            <div className="text-[13px] font-medium text-[#999999]">{description}</div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
