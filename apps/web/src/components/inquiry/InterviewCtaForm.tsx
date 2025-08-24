'use client'

import { useForm } from 'react-hook-form'

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

import TextInputField from './TextInputField'

const interviewCtaFormSchema = z.object({
  name: z.string().min(1, { message: '이름은 필수입니다.' }),
  product: z.string().min(1, { message: '낙찰 상품은 필수입니다.' }),
  email: z.string().email({ message: '유효한 이메일 주소를 입력해주세요.' }),
  phone: z
    .string()
    .regex(/^(010)-?[0-9]{4}-?[0-9]{4}$/, {
      message: '유효한 전화번호를 입력해주세요.',
    })
    .transform((val) => val.replace(/-/g, '')),
  consent: z.boolean().refine((val) => val === true, {
    message: '개인정보 수집 및 활용에 동의해야 합니다.',
  }),
})

export default function InterviewCtaForm({ onClose }: { onClose: () => void }) {
  const interviewCtaForm = useForm<z.infer<typeof interviewCtaFormSchema>>({
    resolver: zodResolver(interviewCtaFormSchema),
    defaultValues: {
      name: '',
      product: '',
      email: '',
      phone: '',
      consent: false,
    },
    mode: 'onBlur',
  })

  async function onSubmit(values: z.infer<typeof interviewCtaFormSchema>) {
    try {
      toast.success('인터뷰 신청이 성공적으로 제출되었습니다.')
      interviewCtaForm.reset()
      onClose()
    } catch (error) {
      toast.error('신청 제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const requiredFields = ['name', 'product', 'email', 'phone', 'consent'] as const
  const { formState, watch } = interviewCtaForm

  const requiredValues = watch(requiredFields)

  const allRequiredFieldsValid =
    requiredValues.every((value) => {
      return typeof value === 'boolean' ? value === true : value !== ''
    }) && Object.keys(formState.errors).every((key) => !requiredFields.includes(key as any))

  const formIsValid = allRequiredFieldsValid

  return (
    <div className="flex h-screen max-h-[388px] flex-col md:h-auto md:max-h-none">
      <Form {...interviewCtaForm}>
        <form
          onSubmit={interviewCtaForm.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex-1 space-y-6 px-5 pb-4 pt-2">
            <div className="flex flex-col gap-3">
              <TextInputField
                control={interviewCtaForm.control}
                name="name"
                label="이름"
                placeholder="이름 입력"
                required
              />

              <TextInputField
                control={interviewCtaForm.control}
                name="product"
                label="낙찰 상품 선택"
                placeholder="낙찰 상품을 입력해주세요"
                description="후기를 들려줄 나팔에서 낙찰한 상품명을 작성해주세요."
                required
              />

              <TextInputField
                control={interviewCtaForm.control}
                name="email"
                label="이메일"
                placeholder="이메일 입력"
                type="email"
                required
              />

              <TextInputField
                control={interviewCtaForm.control}
                name="phone"
                label="연락처"
                placeholder="연락처 입력"
                type="tel"
                required
              />

              <FormField
                control={interviewCtaForm.control}
                name="consent"
                render={({ field, fieldState }) => (
                  <FormItem className="mb-2 mt-2 flex items-center">
                    <FormControl>
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="consent-checkbox"
                          className="sr-only"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <label
                          htmlFor="consent-checkbox"
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
                      htmlFor="consent-checkbox"
                      className={`cursor-pointer text-sm ${fieldState.error ? 'text-red-500' : ''}`}
                    >
                      개인정보 수집 및 활용에 동의합니다.
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
              인터뷰 신청하기
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}
