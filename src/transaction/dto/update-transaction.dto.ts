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
import { TransactionCategory } from '../transaction-category.enum';
import { TransactionType } from '../transaction-type.enum';

export class UpdateTransactionDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(0)
  amount: number;

  @IsEnum(TransactionCategory, { message: 'invalid transaction category' })
  @IsNotEmpty()
  category: TransactionCategory;

  @IsEnum(TransactionType, { message: 'invalid transaction type' })
  @IsNotEmpty()
  type: TransactionType;

  @IsOptional()
  @Length(0, 400)
  description: string;
}
