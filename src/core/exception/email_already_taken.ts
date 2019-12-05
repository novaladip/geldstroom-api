import { ErrorType } from './error_type';
import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyTaken extends HttpException {
  constructor(email?: string) {
    super(
      {
        error: `${email || 'Email'} is already taken`,
        message: 'Use reset password if your forgot your password',
        errorType: ErrorType.EMAIL_IS_ALREADY_TAKEN,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
