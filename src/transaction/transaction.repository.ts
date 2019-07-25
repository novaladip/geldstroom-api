import { Repository, EntityRepository } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';

import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  private logger = new Logger('TransactionRepository');

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    try {
      const { amount, description, category, type } = createTransactionDto;
      const transaction = new Transaction();
      transaction.amount = parseInt(amount);
      transaction.category = category;
      transaction.description = description;
      transaction.createdAt = new Date();
      transaction.type = type;
      await transaction.save();
      return transaction;
    } catch (error) {
      this.logger.error(
        `Failed to create transaction with data: ${JSON.stringify(
          createTransactionDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
