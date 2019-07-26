import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { TransactionCategory } from './transaction-category.enum';
import { TransactionType } from './transaction-type.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  category: TransactionCategory;

  @Column()
  type: TransactionType;

  @Column({ readonly: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(type => User, user => user.transaction, {
    eager: false,
  })
  user: User;

  @Column({ nullable: false })
  userId: number;
}
