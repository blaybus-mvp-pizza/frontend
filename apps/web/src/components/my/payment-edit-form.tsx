'use client'

import { SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import { toast } from 'sonner'
import { z } from 'zod'

import TextInputField from '../inquiry/TextInputField'

const paymentEditFormSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^(\d{4}-\d{4}-\d{4}-\d{4}|\d{16})$/, '카드 번호 16자리를 입력해 주세요.'),
  expiryMonth: z.string().length(2, '월(2자리)을 입력해 주세요.'),
  expiryYear: z.string().length(2, '연도(2자리)를 입력해 주세요.'),
  password: z.string().length(2, '비밀번호 앞 2자리를 입력해 주세요.'),
  birthDate: z.string().length(6, '생년월일 6자리를 입력해 주세요.'),
  isDefaultPayment: z.boolean().default(false),
})

export default function PaymentEditForm({ onClose }: { onClose: () => void }) {
  const paymentForm = useForm({
    resolver: zodResolver(paymentEditFormSchema),
    defaultValues: {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      password: '',
      birthDate: '',
      isDefaultPayment: false,
    },
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<z.infer<typeof paymentEditFormSchema>> = async (values) => {
    try {
      toast.success('결제 수단이 성공적으로 등록되었습니다.')
      paymentForm.reset()
      onClose()
    } catch (error) {
      toast.error('등록 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const requiredFields = [
    'cardNumber',
    'expiryMonth',
    'expiryYear',
    'password',
    'birthDate',
  ] as const
  const { formState, watch } = paymentForm

  const requiredValues = watch(requiredFields)

  const allRequiredFieldsValid =
    requiredValues.every((value) => {
      return typeof value === 'boolean' ? value === true : value !== ''
    }) && Object.keys(formState.errors).every((key) => !requiredFields.includes(key as any))

  const formIsValid = allRequiredFieldsValid

  return (
    <div className="flex h-screen max-h-[388px] flex-col md:h-auto md:max-h-none">
      <Form {...paymentForm}>
        <form
          onSubmit={paymentForm.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex-1 space-y-6 px-5 pb-4 pt-2">
            <div className="flex flex-col gap-3">
              <TextInputField
                control={paymentForm.control}
                name="cardNumber"
                label="카드 번호"
                placeholder="0000-0000-0000-0000"
                required
                type="text"
                inputMode="numeric"
              />

              <div className="flex gap-2">
                <TextInputField
                  control={paymentForm.control}
                  name="expiryMonth"
                  label="유효기간"
                  placeholder="MM"
                  required
                  type="number"
                  inputMode="numeric"
                />
                <TextInputField
                  control={paymentForm.control}
                  name="expiryYear"
                  label=" "
                  placeholder="YY"
                  required
                  type="number"
                  inputMode="numeric"
                />
              </div>

              <TextInputField
                control={paymentForm.control}
                name="password"
                label="카드 비밀번호 앞 2자리"
                placeholder="앞 2자리를 입력해주세요."
                required
                type="password"
                inputMode="numeric"
              />

              <TextInputField
                control={paymentForm.control}
                name="birthDate"
                label="소유주 생년월일"
                placeholder="예) 920101"
                required
                type="number"
                inputMode="numeric"
              />

              <FormField
                control={paymentForm.control}
                name="isDefaultPayment"
                render={({ field, fieldState }) => (
                  <FormItem className="mb-2 mt-2 flex items-center">
                    <FormControl>
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="default-payment-checkbox"
                          className="sr-only"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <label
                          htmlFor="default-payment-checkbox"
                          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-[4px] border-2 transition-colors duration-200 ${
                            field.value
                              ? 'border-[#2FC9B4] bg-[#2FC9B4]'
                              : 'border-[#E5E5EC] bg-[#E5E5EC]'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`h-4 w-4 transition-opacity duration-200 ${
                              field.value ? 'opacity-100' : 'opacity-100'
                            }`}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </label>
                      </div>
                    </FormControl>
                    <FormLabel
                      htmlFor="default-payment-checkbox"
                      className={`cursor-pointer text-sm ${fieldState.error ? 'text-red-500' : ''}`}
                    >
                      기본 결제수단으로 등록
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="sticky bottom-0 mt-auto h-[84px] w-full rounded-lg bg-white px-5 py-4">
            <button
              type="submit"
              disabled={!formIsValid}
              className={`h-[56px] w-full rounded-sm px-[16px] py-[17px] text-[16px] font-bold text-white ${
                formIsValid ? 'bg-[#2FC9B4]' : 'bg-[#999999]'
              }`}
            >
              등록 완료
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}
