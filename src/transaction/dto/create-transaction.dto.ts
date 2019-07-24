import { TransactionCategory } from '../transaction-category.enum';

export class CreateTransactionDto {
  amount: number;
  category: TransactionCategory;
  description: string;
}
