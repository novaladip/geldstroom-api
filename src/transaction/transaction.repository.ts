import { Logger, InternalServerErrorException } from '@nestjs/common';
import { Repository, EntityRepository, Between } from 'typeorm';
import * as moment from 'moment';

import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  private logger = new Logger('TransactionRepository');

  async getTransactions(
    user: JwtPayload,
    getTransactionsFilterDto: GetTransactionsFilterDto,
  ): Promise<Transaction[]> {
    let startDate: Date | string;
    let endDate: Date | string;
    const { date, category, type, isMonthly } = getTransactionsFilterDto;
    const limit = getTransactionsFilterDto.limit
      ? parseInt(getTransactionsFilterDto.limit)
      : 10;
    const page = getTransactionsFilterDto.page
      ? parseInt(getTransactionsFilterDto.page)
      : 1;

    [startDate, endDate] = this.getOneDayRange(new Date(date));
    const query = this.createQueryBuilder('transaction');

    query.where('transaction.userId = :userId', { userId: user.id });
    query.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    });

    if (isMonthly === 1) {
      [startDate, endDate] = this.getOneMonthRange(new Date(date));
    }

    if (category) {
      query.andWhere('transaction.category = :category', { category });
    }

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    query.take(limit);
    query.skip(limit * (page - 1));
    query.orderBy('transaction.createdAt', 'DESC');

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

  private getOneDayRange(date: Date): Date[] {
    return [
      new Date(new Date(date).setUTCHours(24, 0, 0, 0)),
      new Date(new Date(date).setUTCHours(47, 59, 59, 59)),
    ];
  }

  private getOneMonthRange(date: Date): string[] {
    const firstDay = moment
      .utc(date)
      .startOf('month')
      .format();
    const lastDay = moment
      .utc(date)
      .endOf('month')
      .format();
    return [firstDay, lastDay];
  }
}
