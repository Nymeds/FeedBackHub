import { AxiosError } from "axios";
import { useToast } from "../context/ToastProvider";

interface ApiError {
  message: string;
  details?: { field: string; message: string }[];
}

export function parseApiError(err: unknown): string {
  let errorMessage = "Erro desconhecido";


  if ((err as AxiosError)?.isAxiosError) {
    const axiosErr = err as AxiosError<ApiError>;
    if (axiosErr.response?.data) {
      const data = axiosErr.response.data;
      if (data.details && data.details.length > 0) {
        errorMessage = data.details.map(d => `${d.field}: ${d.message}`).join("\n");
      } else {
        errorMessage = data.message || "Erro de comunicação com servidor";
      }
    } else {
      errorMessage = axiosErr.message || "Falha de conexão com servidor";
    }
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }

  return errorMessage;
}


export function useApiErrorHandler() {
  const { showToast } = useToast();

  return (err: unknown) => {
    const message = parseApiError(err);
    showToast(message);
    console.error("API Error:", err);
  };
}
