'use client'

import { useState } from 'react'
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

import FormLabelWithStatus from './FormLabelWithStatus'
import TextInputField from './TextInputField'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

const partnershipInquiryFormSchema = z.object({
  companyName: z.string().min(1, { message: '회사/브랜드명은 필수입니다.' }),
  contactPerson: z.string().min(1, { message: '담당자 이름은 필수입니다.' }),
  email: z.string().email({ message: '유효한 이메일 주소를 입력해주세요.' }),
  website: z.string().optional(),
  proposal: z.string().min(1, { message: '상품 또는 제안 내용을 입력해주세요.' }),
  files: z
    .any()
    .refine(
      (files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
      `파일 크기는 5MB를 초과할 수 없습니다.`,
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      'png, pdf, ppt 파일만 업로드할 수 있습니다.',
    )
    .optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: '개인정보 수집 및 활용에 동의해야 합니다.',
  }),
})

export default function PartnershipInquiryForm({ onClose }: { onClose: () => void }) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const partnershipInquiryForm = useForm<z.infer<typeof partnershipInquiryFormSchema>>({
    resolver: zodResolver(partnershipInquiryFormSchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      email: '',
      website: '',
      proposal: '',
      consent: false,
    },
    mode: 'onBlur',
  })

  async function onSubmit(values: z.infer<typeof partnershipInquiryFormSchema>) {
    try {
      toast.success('파트너십 문의가 성공적으로 제출되었습니다.')
      partnershipInquiryForm.reset()
      setSelectedFiles(null)
      onClose()
    } catch (error) {
      toast.error('문의 제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    setSelectedFiles(files)
  }

  const getFileName = () => {
    if (selectedFiles && selectedFiles.length > 0) {
      return selectedFiles?.[0]?.name
    }
    return ''
  }

  const requiredFields = ['companyName', 'contactPerson', 'email', 'proposal', 'consent'] as const
  const { formState, watch } = partnershipInquiryForm

  const requiredValues = watch(requiredFields)

  const allRequiredFieldsValid =
    requiredValues.every((value) => {
      return typeof value === 'boolean' ? value === true : value !== ''
    }) && Object.keys(formState.errors).every((key) => !requiredFields.includes(key as any))

  const formIsValid = allRequiredFieldsValid

  return (
    <div className="flex h-screen max-h-[388px] flex-col md:h-auto md:max-h-none">
      <Form {...partnershipInquiryForm}>
        <form
          onSubmit={partnershipInquiryForm.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex-1 space-y-6 px-5 pb-4 pt-2">
            <div className="flex flex-col gap-3">
              <TextInputField
                control={partnershipInquiryForm.control}
                name="companyName"
                label="회사/브랜드명"
                placeholder="회사/브랜드명 입력"
                required
              />

              <TextInputField
                control={partnershipInquiryForm.control}
                name="contactPerson"
                label="담당자 이름"
                placeholder="담당자 이름 입력"
                required
              />

              <TextInputField
                control={partnershipInquiryForm.control}
                name="email"
                label="담당자 이메일"
                placeholder="담당자 이메일 입력"
                type="email"
                required
              />

              <TextInputField
                control={partnershipInquiryForm.control}
                name="website"
                label="회사 웹사이트 또는 SNS"
                placeholder="회사 웹사이트 또는 SNS 입력"
                required={false}
              />

              <FormField
                control={partnershipInquiryForm.control}
                name="proposal"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabelWithStatus
                      label="상품 또는 제안 내용 소개"
                      required
                      isError={!!fieldState.error}
                    />
                    <FormControl>
                      <textarea
                        placeholder="500자 이내 입력"
                        rows={5}
                        {...field}
                        className={`h-[120px] w-full resize-none rounded-none p-4 text-sm font-medium shadow-none outline-none focus:border-black focus:ring-0 ${
                          fieldState.error ? 'border border-red-500' : 'border border-[#E5E5EC]'
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={partnershipInquiryForm.control}
                name="files"
                render={({ field: { value, onChange, ...field }, fieldState }) => (
                  <FormItem>
                    <FormLabelWithStatus
                      label="참고자료 업로드"
                      required={false}
                      isError={!!fieldState.error}
                    />
                    <FormControl>
                      <div
                        className={`relative flex h-[48px] w-full items-center justify-between rounded-none pb-2 pl-4 pr-2 pt-2 text-sm text-gray-500 shadow-none outline-none focus:border-transparent focus:ring-0 ${
                          fieldState.error ? 'border border-red-500' : 'border border-[#E5E5EC]'
                        }`}
                      >
                        <input
                          type="file"
                          id="file-upload"
                          className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                          onChange={(e) => {
                            onChange(e.target.files)
                            handleFileChange(e)
                          }}
                          accept={ACCEPTED_FILE_TYPES.join(',')}
                          {...field}
                        />
                        <span className="truncate">
                          {getFileName() || 'png, pdf, ppt 업로드 가능'}
                        </span>
                        <label
                          htmlFor="file-upload"
                          className="shrink-0 cursor-pointer rounded-none border border-[#E5E5EC] bg-[#F1F1F5] px-4 py-2 text-xs font-semibold text-black hover:bg-gray-200"
                        >
                          파일 업로드
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={partnershipInquiryForm.control}
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
              문의하기
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}
