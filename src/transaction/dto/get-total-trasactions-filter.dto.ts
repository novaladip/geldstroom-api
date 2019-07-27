import { IsOptional, IsNotEmpty, Matches, IsEnum } from 'class-validator';
import { TransactionCategory } from '../transaction-category.enum';
import { Transform } from 'class-transformer';

export enum IsMonthly {
  TRUE = 1,
  FALSE = 0,
}

export class GetTotalTransactionsFilterDto {
  @IsNotEmpty()
  @Matches(/([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01]))/, {
    message: 'date format must be YYYY/MM/DD',
  })
  date: string;

  @IsEnum(TransactionCategory, { message: 'Invalid category' })
  @IsOptional()
  @IsNotEmpty()
  category: TransactionCategory;

  @Transform(value => Number(value))
  @IsEnum(IsMonthly)
  isMonthly: number;
}
