import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TransactionModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
