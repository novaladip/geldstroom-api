import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger('TransactionService');

  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async getTranscations(user: JwtPayload): Promise<Transaction[]> {
    return this.transactionRepository.getTransactions(user);
  }

  async getTransactionById(id: number, user: JwtPayload): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: id, userId: user.id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
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
    id: number,
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

  async deleteTransactionById(id: number): Promise<void> {
    const result = await this.transactionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }
}
