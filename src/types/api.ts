export type ApiStatus = "success" | "error";

export type ApiError = {
  code: string;
  message: string;
};

export type ApiSuccess<T> = {
  ok: true;
  status: "success";
  data: T;
  message?: string;
};

export type ApiFailure = {
  ok: false;
  status: "error";
  error: ApiError;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export const apiSuccess = <T>(data: T, message?: string): ApiSuccess<T> => ({
  ok: true,
  status: "success",
  data,
  message,
});

export const apiFailure = (error: ApiError): ApiFailure => ({
  ok: false,
  status: "error",
  error,
});
