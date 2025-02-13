export interface ApiResponseType<T = undefined> {
  statusCode: number;
  message: string;
  data: T | null;
  error?: string | null;
  timestamp?: string;
}
