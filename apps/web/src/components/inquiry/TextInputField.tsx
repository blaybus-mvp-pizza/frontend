import { Control, FieldValues, Path } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormMessage } from '@workspace/ui/components/form'

import FormLabelWithStatus from './FormLabelWithStatus'

type TextInputFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  placeholder: string
  type?: string
  required?: boolean
  description?: string
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
}

export default function TextInputField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  description,
  inputMode = 'text',
}: TextInputFieldProps<TFieldValues>) {
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
              inputMode={inputMode}
              {...field}
              className={`h-[48px] w-full rounded-none px-4 py-2 text-sm font-medium shadow-none outline-none focus:border-black focus:ring-0 ${
                fieldState.error ? 'border border-red-500' : 'border border-[#E5E5EC]'
              }`}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                let formattedValue = ''

                if (name === 'phone') {
                  if (value.length > 3 && value.length <= 7) {
                    formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`
                  } else if (value.length > 7) {
                    formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(
                      7,
                      11,
                    )}`
                  } else {
                    formattedValue = value
                  }
                  field.onChange(formattedValue)
                } else if (name === 'cardNumber') {
                  if (value.length > 4 && value.length <= 8) {
                    formattedValue = `${value.slice(0, 4)}-${value.slice(4)}`
                  } else if (value.length > 8 && value.length <= 12) {
                    formattedValue = `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8)}`
                  } else if (value.length > 12) {
                    formattedValue = `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(
                      8,
                      12,
                    )}-${value.slice(12, 16)}`
                  } else {
                    formattedValue = value
                  }
                  field.onChange(formattedValue)
                } else {
                  field.onChange(e.target.value)
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
