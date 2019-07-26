import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, readonly: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  joinDate: Date;

  @OneToMany(type => Transaction, transaction => transaction.user, {
    eager: true,
  })
  transaction: Transaction[];
}
