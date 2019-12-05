import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { SendEmailModule } from './send-email/send-email.module';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TransactionModule, AuthModule, SendEmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
