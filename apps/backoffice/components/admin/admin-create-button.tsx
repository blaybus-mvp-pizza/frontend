"use client";

import axios from "axios";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminCreateButton() {
  const queryClient = useQueryClient();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/admin", { nickname, password });
      toast.success("관리자 계정이 성공적으로 생성되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setOpen(false);
    } catch (error: any) {
      let errorMessage = "";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else {
        errorMessage = error.message;
      }
      toast.error("관리자 생성에 실패했습니다.", { description: errorMessage });
    } finally {
      setNickname("");
      setPassword("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>관리자 생성</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>관리자 생성</DialogTitle>
          <DialogDescription>
            새로운 관리자 계정 정보를 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='nickname' className='text-right'>
                아이디
              </Label>
              <Input
                id='nickname'
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='password' className='text-right'>
                비밀번호
              </Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button type='submit'>생성하기</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
