import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
