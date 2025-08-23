"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const loginFormSchema = z.object({
  id: z.string().min(1, { message: "아이디를 입력해주세요." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});

export default function LoginForm() {
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      id: "superadmin",
      password: "123",
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginFormSchema>) {
    await signIn("credentials", {
      redirect: false,
      id: values.id,
      password: values.password,
    }).then((res) => {
      if (res?.error) {
        toast.error("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        toast.success("로그인 성공");
        router.push("/dashboard");
      }
    });
  }

  return (
    <Form {...loginForm}>
      <div className='flex flex-col items-center gap-1 text-center mb-6'>
        <p className='text-muted-foreground text-sm text-balance'>
          가치 있는 소비, 특별한 시작
        </p>
        <h1 className='text-2xl font-bold'>관리자 로그인</h1>
      </div>
      <form
        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
        className='w-full max-w-sm space-y-4'
      >
        <FormField
          control={loginForm.control}
          name='id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>아이디</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input {...field} type='password' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full'>
          로그인
        </Button>
      </form>
    </Form>
  );
}
