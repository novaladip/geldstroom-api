import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';

import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
