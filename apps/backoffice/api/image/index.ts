import axios from "axios";

export type EntityType = "product" | "store" | "story" | "profile";

interface PresignResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

interface UploadResponse {
  fileUrl: string;
  key: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 서버에 presign API를 호출하여 이미지 업로드 URL을 받아오는 함수
 * @param filename 업로드할 파일 이름
 * @param contentType 파일의 MIME 타입 (예: "image/jpeg")
 * @param entity 파일의 용도 ('product' | 'store' | 'story' | 'profile')
 * @returns 업로드 URL, 파일 URL, 그리고 키 정보
 */
const getPresignedUrl = async (
  filename: string,
  contentType: string,
  entity: EntityType
): Promise<PresignResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/v1/storage/presign`,
      {
        filename,
        contentType,
        entity,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Presign URL 발급에 실패했습니다."
      );
    }
    throw new Error("네트워크 오류가 발생했습니다.");
  }
};

/**
 * 이미지를 서버를 거치지 않고 S3에 직접 업로드하는 함수
 * @param file 업로드할 이미지 파일 (File 객체)
 * @param entity 파일의 용도 ('product' | 'store' | 'story' | 'profile')
 * @returns 업로드된 파일의 URL과 키
 */
export const uploadImage = async (
  file: File,
  entity: EntityType
): Promise<UploadResponse> => {
  try {
    const { uploadUrl, fileUrl, key } = await getPresignedUrl(
      file.name,
      file.type,
      entity
    );

    const response = await axios.post(
      `${API_BASE_URL}/users/v1/storage/upload`,
      {
        file,
        entity,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "이미지 업로드에 실패했습니다."
      );
    }
    throw new Error("네트워크 오류가 발생했습니다.");
  }
};
