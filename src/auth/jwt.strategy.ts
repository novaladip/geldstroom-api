import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as config from 'config';

import { UserRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { EmailNotVerfied } from '../core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<JwtPayload> {
    const { id } = jwtPayload;
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.isVerified) {
      throw new EmailNotVerfied();
    }

    return { id, email: user.email };
  }
}
