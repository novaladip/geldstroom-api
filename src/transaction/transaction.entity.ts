import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TransactionCategory } from './transaction-category.enum';
import { TransactionType } from './transaction-type.enum';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  category: TransactionCategory;

  @Column()
  description: string;

  @Column()
  createdAt: Date;

  @Column()
  type: TransactionType;
}
