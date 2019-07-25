import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger('TransactionService');

  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async getTranscations(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionRepository.createTransaction(createTransactionDto);
  }

  async updateTransactionById(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionRepository.updateTransactionById(
      id,
      updateTransactionDto,
    );
  }
}
