import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { NotificationStatus } from '../enums/notification-status.enums';

@Entity()
export class NotificationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventType: string;

  @Column()
  recipient: string;

  @Column()
  channel: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
  })
  status: NotificationStatus;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
