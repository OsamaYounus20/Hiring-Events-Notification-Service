// src/db/repositories/notification-log.repository.ts

import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NotificationLog } from '../entities/notification-log.entity';
import { NotificationStatus } from '../enums/notification-status.enums';

@Injectable()
export class NotificationLogRepository extends Repository<NotificationLog> {
  constructor(private dataSource: DataSource) {
    super(NotificationLog, dataSource.createEntityManager());
  }

  async logNotification(
    eventType: string,
    recipient: string,
    channel: string,
    status: NotificationStatus,
    message: string,
  ): Promise<NotificationLog> {
    const log = this.create({ eventType, recipient, channel, status, message });
    return this.save(log);
  }
}
