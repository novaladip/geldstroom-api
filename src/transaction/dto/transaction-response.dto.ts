import { ApiModelProperty } from '@nestjs/swagger';
import { TransactionCategory } from '../transaction-category.enum';
import { TransactionType } from '../transaction-type.enum';

export class TransactionResponseDto {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  amount: number;

  @ApiModelProperty()
  category: TransactionCategory;

  @ApiModelProperty()
  type: TransactionType;

  @ApiModelProperty()
  createdAt: string;

  @ApiModelProperty()
  updatedAt: string;

  @ApiModelProperty()
  description: string;

  @ApiModelProperty()
  userId: string;
}
