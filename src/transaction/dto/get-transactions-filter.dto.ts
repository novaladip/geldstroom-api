import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEnum,
  Matches,
  IsNumberString,
} from 'class-validator';
import { TransactionType } from '../transaction-type.enum';
import { TransactionCategory } from '../transaction-category.enum';
import { Type } from 'class-transformer';

export enum IsMonthly {
  TRUE = 1,
  FALSE = 0,
}

export class GetTransactionsFilterDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Matches(/([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01]))/, {
    message: 'date format must be YYYY/MM/DD',
  })
  date: string;

  @IsEnum(TransactionType, { message: 'Invalid type' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  type: TransactionType;

  @IsEnum(TransactionCategory, { message: 'Invalid category' })
  @IsOptional()
  @IsNotEmpty()
  category: TransactionCategory;

  @Type(() => Number)
  @IsOptional()
  @IsEnum(IsMonthly)
  isMonthly: number;

  @IsNumberString()
  @IsOptional()
  page: string;

  @IsNumberString()
  @IsOptional()
  limit: string;
}
