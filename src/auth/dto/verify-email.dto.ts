import { ApiModelProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiModelProperty()
  token: string;
}
