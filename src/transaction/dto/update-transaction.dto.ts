import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsPositive,
  Min,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

import { TransactionCategory } from '../transaction-category.enum';
import { TransactionType } from '../transaction-type.enum';

export class UpdateTransactionDto {
  @ApiModelProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(0)
  amount: number;

  @ApiModelProperty()
  @IsEnum(TransactionCategory, { message: 'invalid transaction category' })
  @IsNotEmpty()
  category: TransactionCategory;

  @ApiModelProperty()
  @IsEnum(TransactionType, { message: 'invalid transaction type' })
  @IsNotEmpty()
  type: TransactionType;

  @ApiModelProperty()
  @IsOptional()
  @Length(0, 400)
  description: string;
}
