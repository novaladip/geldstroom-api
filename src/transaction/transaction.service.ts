import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto';
import { GetTotalTransactionsFilterDto } from './dto/get-total-trasactions-filter.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger('TransactionService');

  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async getTranscations(
    user: JwtPayload,
    getTransactionsFilterDto: GetTransactionsFilterDto,
  ): Promise<Transaction[]> {
    return this.transactionRepository.getTransactions(
      user,
      getTransactionsFilterDto,
    );
  }

  async getTransactionById(id: string, user: JwtPayload): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: id, userId: user.id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async getTotalTransactions(
    user: JwtPayload,
    getTotalTransactionsFilterDto: GetTotalTransactionsFilterDto,
  ) {
    return this.transactionRepository.getTotalTransactions(
      user,
      getTotalTransactionsFilterDto,
    );
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    user: JwtPayload,
  ): Promise<Transaction> {
    return this.transactionRepository.createTransaction(
      createTransactionDto,
      user,
    );
  }

  async updateTransactionById(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    user: JwtPayload,
  ): Promise<Transaction> {
    const { amount, type, description, category } = updateTransactionDto;
    const transaction = await this.getTransactionById(id, user);
    transaction.amount = amount;
    transaction.type = type;
    transaction.description = description;
    transaction.category = category;
    transaction.updatedAt = new Date();
    await transaction.save();
    return transaction;
  }

  async deleteTransactionById(id: string, user: JwtPayload): Promise<void> {
    const result = await this.transactionRepository.delete({
      id,
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }
}
