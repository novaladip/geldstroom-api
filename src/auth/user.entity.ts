import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
