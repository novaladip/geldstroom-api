import { createParamDecorator } from '@nestjs/common';
import { JwtPayload } from '../auth/jwt-payload.interface';

export const GetUser = createParamDecorator((_, req): JwtPayload => req.user);
