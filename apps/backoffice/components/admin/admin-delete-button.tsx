"use client";

import axios from "axios";
import { Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@workspace/ui/components/alert-dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminDeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient();

  const handleDeleteAdmin = async (id: number) => {
    try {
      await axios.delete(`/api/admin/${id}`);
      toast.success("관리자 계정이 성공적으로 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    } catch (error: any) {
      let errorMessage = "";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else {
        errorMessage = error.message;
      }
      toast.error("관리자 삭제에 실패했습니다.", { description: errorMessage });
    }
  };

  return (
    <div className='flex justify-center'>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Trash2 className='h-4 w-4 text-red-500' />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>관리자를 정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 해당 관리자 계정이 영구적으로
              삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteAdmin(id);
              }}
              className='bg-red-600 hover:bg-red-700'
            >
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
