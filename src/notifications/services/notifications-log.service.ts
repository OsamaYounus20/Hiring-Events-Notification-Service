import { Injectable } from '@nestjs/common';
import { NotificationLogRepository } from '../../db/repositories/notification-log.repository';
import { NotificationStatus } from 'src/db/enums/notification-status.enums';

@Injectable()
export class NotificationLogService {
  constructor(private readonly logRepo: NotificationLogRepository) {}

  async log(
    eventType: string,
    recipient: string,
    channel: string,
    status: NotificationStatus,
    message: string,
  ): Promise<void> {
    await this.logRepo.logNotification(
      eventType,
      recipient,
      channel,
      status,
      message,
    );
  }
}
