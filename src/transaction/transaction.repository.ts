import { Repository, EntityRepository } from 'typeorm';
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  private logger = new Logger('TransactionRepository');

  async getTransactions(user: JwtPayload): Promise<Transaction[]> {
    const query = this.createQueryBuilder('transaction');

    query.where('transaction.userId = :userId', { userId: user.id });

    try {
      const transactions = await query.getMany();
      return transactions;
    } catch (error) {
      this.logger.error(
        `Failed to get transactions for user "${user.email}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    user: JwtPayload,
  ): Promise<Transaction> {
    try {
      const { amount, description, category, type } = createTransactionDto;
      const transaction = new Transaction();
      transaction.amount = parseInt(amount);
      transaction.category = category;
      transaction.description = description;
      transaction.createdAt = new Date();
      transaction.type = type;
      transaction.userId = user.id;
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

  async updateTransactionById(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { amount, category, type, description } = updateTransactionDto;
    const transaction = await this.findOne(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found `);
    }
    transaction.amount = amount;
    transaction.category = category;
    transaction.type = type;
    transaction.description = description;
    transaction.updatedAt = new Date();
    await transaction.save();
    return transaction;
  }
}
