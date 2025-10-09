// src/common/exceptions/custom-http.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    errorData?: any,
  ) {
    super(message, status); // <-- chỉ truyền message và status
    this.name = 'CustomHttpException';
  }
}
