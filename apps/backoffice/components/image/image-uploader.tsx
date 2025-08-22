"use client";
import { EntityType } from "@/api/image";
import { useImageUploader } from "@/hooks/use-image-uploader";
import { useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface ImageUploaderProps {
  entity: EntityType;
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
  existingImageUrl?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  entity,
  onUploadSuccess,
  onRemove,
  existingImageUrl,
}) => {
  const { fileUrl, isLoading, error, handleUpload, clearFileUrl } = useImageUploader();
  const hasReportedRef = useRef(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        hasReportedRef.current = false; 
        await handleUpload(file, entity);
      }
    },
    [handleUpload, entity]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    multiple: false,
  });

  useEffect(() => {
    if (fileUrl && !hasReportedRef.current) {
      onUploadSuccess(fileUrl);
      hasReportedRef.current = true;
      if (clearFileUrl) {
        setTimeout(() => clearFileUrl(), 100);
      }
    }
  }, [fileUrl, onUploadSuccess, clearFileUrl]);

  useEffect(() => {
    return () => {
      if (clearFileUrl) {
        clearFileUrl();
      }
    };
  }, [clearFileUrl]);

  const currentImageUrl = existingImageUrl || fileUrl;

  return (
    <div className='space-y-4'>
      {currentImageUrl ? (
        <div className='relative w-full max-w-[200px] max-h-[200px] mx-auto rounded-lg overflow-hidden border-2 shadow-sm group'>
          <img
            src={currentImageUrl}
            alt='업로드된 이미지'
            className='w-full h-full object-cover aspect-square'
          />
          <Button
            type='button'
            onClick={onRemove}
            variant='outline'
            size='icon'
            className='absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
            aria-label='Remove image'
          >
            <X className='h-4 w-4 text-gray-500' />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors",
            "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600",
            isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""
          )}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <div className='flex items-center space-x-2 text-gray-500 dark:text-gray-400'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>업로드 중...</span>
            </div>
          ) : (
            <div className='space-y-2'>
              <ImageIcon className='h-8 w-8 text-gray-400 mx-auto' />
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                이미지 업로드
              </p>
            </div>
          )}
        </div>
      )}
      {error && (
        <p className='text-sm text-center text-red-500 dark:text-red-400'>
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;