import { EntityRepository, Repository } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as cryptoRandomString from 'crypto-random-string';

import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { EmailAlreadyTaken } from '../core';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async registerUser(registerDto: RegisterDto): Promise<User> {
    try {
      const { email, password } = registerDto;
      const generatedToken = cryptoRandomString({
        length: 50,
        type: 'url-safe',
      });
      const user = new User();
      user.email = email;
      user.password = await this.hashPassword(password);
      user.joinDate = new Date();
      user.token = generatedToken;
      await user.save();
      return user;
    } catch (error) {
      this.logger.error(
        `Failed to registering user with data: ${JSON.stringify(registerDto)}`,
        error.stack,
      );
      if (error.code === '23505') {
        throw new EmailAlreadyTaken();
      }

      throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const generatedSalt = await bcrypt.genSalt(13);
    return await bcrypt.hash(password, generatedSalt);
  }
}
