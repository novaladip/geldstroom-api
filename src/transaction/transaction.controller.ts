import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

@UseGuards(AuthGuard())
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getTransactions(@GetUser() user: JwtPayload): Promise<Transaction[]> {
    return this.transactionService.getTranscations(user);
  }

  @Get('/:id')
  getTransactionById(
    @GetUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Transaction> {
    return this.transactionService.getTransactionById(id, user);
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.updateTransactionById(
      id,
      updateTransactionDto,
    );
  }

  @Delete('/:id')
  deleteTransactionById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.transactionService.deleteTransactionById(id);
  }
}
