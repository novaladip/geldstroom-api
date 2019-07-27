import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiModelProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;
}
