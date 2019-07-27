import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  IsEnum,
  Min,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { TransactionCategory } from '../transaction-category.enum';
import { TransactionType } from '../transaction-type.enum';

export class CreateTransactionDto {
  @ApiModelProperty({
    default: 50000,
    description: 'Transaction amount',
    type: Number,
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(0)
  amount: string;

  @ApiModelProperty({
    default: TransactionCategory.EDUCATION,
    description: 'Transaction category',
  })
  @IsEnum(TransactionCategory, { message: 'invalid transaction category' })
  @IsNotEmpty()
  category: TransactionCategory;

  @ApiModelProperty({
    default: TransactionType.EXPENSE,
    description: 'Transaction type',
  })
  @IsEnum(TransactionType, { message: 'invalid transaction type' })
  @IsNotEmpty()
  type: TransactionType;

  @ApiModelPropertyOptional({
    default: 'Description is okay to be empty',
    description: 'Transaction description',
  })
  @IsOptional()
  @Length(0, 400)
  description: string;
}
