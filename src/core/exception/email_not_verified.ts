import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorType } from './error_type';

export class EmailNotVerfied extends HttpException {
  constructor() {
    super(
      {
        error: 'Email is not verified',
        message: 'Please verify your email first to continue',
        errorType: ErrorType.EMAIL_IS_NOT_VERIFIED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
