import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiUseTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  VerifyEmailDto,
  LoginDto,
  LoginResponse,
  RegisterDto,
  ResendEmailVerifyDto,
} from './dto';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'Its return an empty body' })
  @Post('/register')
  registerUser(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.registerUser(registerDto);
  }

  @ApiOkResponse({
    description: 'Its return a JWT Token',
    type: LoginResponse,
  })
  @Post('/login')
  loginUser(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.loginUser(loginDto);
  }

  @ApiOkResponse({})
  @Get('verify/email')
  verifyEmail(
    @Query(ValidationPipe) verifyEmailDto: VerifyEmailDto,
  ): Promise<void> {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @ApiOkResponse({})
  @Post('verify/email/resend')
  resendVerifyEmail(@Body() resendVerifyEmailDto: ResendEmailVerifyDto) {
    return this.authService.resendEmailVerify(resendVerifyEmailDto);
  }
}
