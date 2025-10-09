
// src/common/dto/response.dto.ts
export class ResponseDto<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;

  constructor(success: boolean, message: string, data?: T, error?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(message: string, data?: T): ResponseDto<T> {
    return new ResponseDto<T>(true, message, data);
  }

  static fail(message: string, error?: any): ResponseDto {
    return new ResponseDto(false, message, null, error);
  }
}
