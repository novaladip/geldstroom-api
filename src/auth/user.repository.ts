import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');
}
