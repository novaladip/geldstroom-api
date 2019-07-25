import { EntityRepository, Repository } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async registerUser(registerDto: RegisterDto): Promise<void> {
    try {
      const { email, password } = registerDto;
      const user = new User();
      user.email = email;
      user.password = await this.hashPassword(password);
      user.joinDate = new Date();
      await user.save();
    } catch (error) {
      this.logger.error(
        `Failed to registering user with data: ${JSON.stringify(registerDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async hashPassword(password: string): Promise<string> {
    const generatedSalt = await bcrypt.genSalt(13);
    return await bcrypt.hash(password, generatedSalt);
  }
}
