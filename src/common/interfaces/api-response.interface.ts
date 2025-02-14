export interface ApiResponseType<T = undefined> {
  statusCode: number;
  message: string;
  data: T | null;
  cookies?: {
    name: string;
    value: string;
    options: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
      maxAge: number;
    };
  }[];
  error?: string | null;
  timestamp?: string;
}
