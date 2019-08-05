import { Logger, InternalServerErrorException } from '@nestjs/common';
import { Repository, EntityRepository, Between } from 'typeorm';
import * as moment from 'moment';

import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
import {
  GetTransactionsFilterDto,
  IsMonthly,
} from './dto/get-transactions-filter.dto';
import { GetTotalTransactionsFilterDto } from './dto/get-total-trasactions-filter.dto';
import { TransactionType } from './transaction-type.enum';

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

    [startDate, endDate] =
      isMonthly == IsMonthly.TRUE
        ? this.getOneMonthRange(date)
        : this.getOneDayRange(date);

    const query = this.createQueryBuilder('transaction');

    query.where('transaction.userId = :userId', { userId: user.id });
    query.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    });

    if (category) {
      query.andWhere('transaction.category = :category', { category });
    }

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    if (limit > 0) {
      query.take(limit);
      query.skip(limit * (page - 1));
    }
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

  async getTotalTransactions(
    user: JwtPayload,
    getTotalTransactionsFilterDto: GetTotalTransactionsFilterDto,
  ): Promise<{ INCOME: number | null; EXPENSE: number | null }[]> {
    const totalIncome = this.getTotalAmount(
      user.id,
      getTotalTransactionsFilterDto,
      TransactionType.INCOME,
    );
    const totalExpense = this.getTotalAmount(
      user.id,
      getTotalTransactionsFilterDto,
      TransactionType.EXPENSE,
    );
    return await Promise.all([totalIncome, totalExpense]);
  }

  private getTotalAmount(
    userId: string,
    getTotalTransactionsFilterDto: GetTotalTransactionsFilterDto,
    type: TransactionType,
  ) {
    const { date, isMonthly, category } = getTotalTransactionsFilterDto;
    const [startDate, endDate] =
      isMonthly == 1 ? this.getOneMonthRange(date) : this.getOneDayRange(date);

    const query = this.createQueryBuilder('transaction');
    query
      .select('SUM(transaction.amount)', type)
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (category) {
      query.andWhere('transaction.category = :category', { category });
    }

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    return query.getRawOne();
  }

  private getOneDayRange(date: string): Date[] {
    const startDate = moment.utc(date, 'YYYY/MM/DD').startOf('days');
    const endDate = moment.utc(date, 'YYYY/MM/DD').endOf('days');
    return [
      new Date(new Date(startDate.format())),
      new Date(new Date(endDate.format())),
    ];
  }

  private getOneMonthRange(date: string): Date[] {
    const firstDay = moment
      .utc(date, 'YYYY/MM/DD')
      .startOf('month')
      .format();
    const lastDay = moment
      .utc(date, 'YYYY/MM/DD')
      .endOf('month')
      .format();
    return [new Date(firstDay), new Date(lastDay)];
  }
}
