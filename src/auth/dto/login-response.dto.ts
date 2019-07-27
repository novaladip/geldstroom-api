import { ApiModelProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiModelProperty()
  accessToken: string;
}
