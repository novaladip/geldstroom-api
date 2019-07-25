import { Controller, Post, Body, Inject } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerUser(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.registerUser(registerDto);
  }
}
