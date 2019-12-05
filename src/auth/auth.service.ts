import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { EmailNotVerfied } from '../core';
import {
  VerifyEmailDto,
  RegisterDto,
  LoginDto,
  ResendEmailVerifyDto,
} from './dto';
import { SendEmailService } from '../send-email/send-email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly sendEmailService: SendEmailService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDto): Promise<void> {
    const user = await this.userRepository.registerUser(registerDto);
    this.sendEmailService.emailVerification(user.token, user.email);
  }

  async loginUser(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new EmailNotVerfied();
    }

    const payload: JwtPayload = { email, id: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken: `Bearer ${accessToken}` };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    try {
      const { token } = verifyEmailDto;
      console.log(token);
      if (!token) {
        throw new BadRequestException('Token not found');
      }

      const user = await this.userRepository.findOne({ token });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isVerified) {
        throw new BadRequestException('Email is already verified');
      }

      user.isVerified = true;
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async resendEmailVerify(
    resendEmailVerifyDto: ResendEmailVerifyDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      email: resendEmailVerifyDto.email,
    });

    if (!user) {
      throw new NotFoundException('Invalid token');
    }
    await this.sendEmailService.emailVerification(user.token, user.email);
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
