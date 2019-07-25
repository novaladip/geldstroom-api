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
import { Type } from 'class-transformer';
import { TransactionCategory } from '../transaction-category.enum';
import { TransactionType } from '../transaction-type.enum';

export class CreateTransactionDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(0)
  amount: string;

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
