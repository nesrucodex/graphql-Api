export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  result: T | null;
};
