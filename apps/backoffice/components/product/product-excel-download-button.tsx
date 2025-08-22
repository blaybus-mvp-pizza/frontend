"use client";

import axios from "axios";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

export default function ProductExcelDownloadButton() {
  const handleDownload = async () => {
    try {
      const response = await axios.get("/api/product/excel", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.xlsx");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("데이터를 엑셀 파일로 내보냈습니다");
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      toast.error("데이터를 엑셀 파일로 내보내는 데 실패했습니다.");
    }
  };

  return <Button onClick={handleDownload}>엑셀 다운로드</Button>;
}
