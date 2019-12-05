import { ApiModelProperty } from '@nestjs/swagger';

export class ResendEmailVerifyDto {
  @ApiModelProperty()
  email: string;
}
