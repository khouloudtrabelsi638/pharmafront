export interface BackendError {
  status: number;
  error: string;
  message: string | string[];
  timestamp: string;
}
