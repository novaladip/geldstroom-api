import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto';
import { GetTotalTransactionsFilterDto } from './dto/get-total-trasactions-filter.dto';

@UseGuards(AuthGuard())
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getTransactions(
    @GetUser() user: JwtPayload,
    @Query(ValidationPipe) getTransactionsFilterDto: GetTransactionsFilterDto,
  ): Promise<Transaction[]> {
    return this.transactionService.getTranscations(
      user,
      getTransactionsFilterDto,
    );
  }

  @Get('/:id')
  getTransactionById(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<Transaction> {
    return this.transactionService.getTransactionById(id, user);
  }

  @Get('/total/amount')
  getTotalTransactions(
    @GetUser() user: JwtPayload,
    @Query(ValidationPipe)
    getTotalTransactionsFilterDto: GetTotalTransactionsFilterDto,
  ) {
    return this.transactionService.getTotalTransactions(
      user,
      getTotalTransactionsFilterDto,
    );
  }

  @Post()
  createTransaction(
    @GetUser() user: JwtPayload,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(
      createTransactionDto,
      user,
    );
  }

  @Put('/:id')
  updateTransactionById(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateTransactionsDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.updateTransactionById(
      id,
      updateTransactionsDto,
      user,
    );
  }

  @Delete('/:id')
  deleteTransactionById(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    return this.transactionService.deleteTransactionById(id, user);
  }
}
