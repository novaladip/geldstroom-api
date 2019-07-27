import { ApiModelProperty } from '@nestjs/swagger';

export class GetTotalTransactionsReponseDto {
  @ApiModelProperty({
    description: 'If the data is empty, it will return null.',
  })
  INCOME: string | null;

  @ApiModelProperty({
    description: 'If the data is empty, it will return null.',
  })
  EXPENSE: string | null;
}
