import { Controller, Post, Body, Inject, Get, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerUser(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.registerUser(registerDto);
  }

  @Post('/login')
  loginUser(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.loginUser(loginDto);
  }
}
