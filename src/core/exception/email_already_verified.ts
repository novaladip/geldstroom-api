import { ErrorType } from './error_type';
import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyVerified extends HttpException {
  constructor(email?: string) {
    super(
      {
        error: `${email || 'Email'} is already verified`,
        message:
          'You can login now and start use the full feature of Geldstroom App',
        errorType: ErrorType.EMAIL_IS_ALREADY_VERIFIED,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
