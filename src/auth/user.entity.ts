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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false, readonly: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  joinDate: Date;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(type => Transaction, transaction => transaction.user, {
    eager: true,
  })
  transaction: Transaction[];
}
