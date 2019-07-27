import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEnum,
  Matches,
  IsNumberString,
} from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { TransactionType } from '../transaction-type.enum';
import { TransactionCategory } from '../transaction-category.enum';

export enum IsMonthly {
  TRUE = 1,
  FALSE = 0,
}

export class GetTransactionsFilterDto {
  @ApiModelProperty({
    description: 'Date format: "YYYY/MM/DD"',
    default: '2019/07/28',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01]))/, {
    message: 'date format must be YYYY/MM/DD',
  })
  date: string;

  @ApiModelPropertyOptional({
    default: TransactionType.EXPENSE,
    description: `One of: "${Object.keys(TransactionType).map(type => type)}"`,
  })
  @IsEnum(TransactionType, { message: 'Invalid type' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  type: TransactionType;

  @ApiModelPropertyOptional({
    default: TransactionCategory.EDUCATION,
    description: `One of: "${Object.keys(TransactionCategory).map(
      type => type,
    )}"`,
  })
  @IsEnum(TransactionCategory, { message: 'Invalid category' })
  @IsOptional()
  @IsNotEmpty()
  category: TransactionCategory;

  @ApiModelPropertyOptional({
    type: Number,
    default: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(IsMonthly)
  isMonthly: number;

  @ApiModelPropertyOptional({
    default: 1,
    description: 'Page type must be a number of string',
  })
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  page: string;

  @ApiModelPropertyOptional({
    default: 10,
    description: 'A limit of data/page, set to 0 to get whole data.',
  })
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  limit: string;
}
