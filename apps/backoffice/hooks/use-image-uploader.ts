import { EntityType, uploadImage } from "@/api/image";
import { useState } from "react";

interface UploadResponse {
  fileUrl: string;
  key: string;
}

interface UseImageUploaderResult {
  fileUrl: string | null;
  isLoading: boolean;
  error: string | null;
  handleUpload: (file: File, entity: EntityType) => Promise<UploadResponse>;
}

export const useImageUploader = (): UseImageUploaderResult => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (
    file: File,
    entity: EntityType
  ): Promise<UploadResponse> => {
    setIsLoading(true);
    setError(null);
    setFileUrl(null);

    try {
      const response = await uploadImage(file, entity);
      setFileUrl(response.fileUrl);

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { fileUrl, isLoading, error, handleUpload };
};
