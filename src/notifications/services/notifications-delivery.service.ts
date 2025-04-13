import { Injectable } from '@nestjs/common';
import { NotificationStatus } from 'src/db/enums/notification-status.enums';
import { HiringEventDto } from 'src/notifications/dtos/hiring-event.dto';
import { routingMap } from 'src/notifications/notifications.factory';
import { NotificationLogService } from 'src/notifications/services/notifications-log.service';

@Injectable()
export class NotificationDeliveryService {
  constructor(private readonly logService: NotificationLogService) {}

  async deliverViaChannel(
    channel: 'email' | 'console' | 'push',
    adapter: { send: (identifier: string, message: string) => Promise<void> },
    event: HiringEventDto,
    prefix: string = channel.toUpperCase(),
  ): Promise<void> {
    const route = routingMap[event.type];
    if (!route || !route.channels.includes(channel)) return;

    const message = `[${prefix}] ${event.type} - ${JSON.stringify(event.payload)}`;

    for (const recipient of event.recipients) {
      if (!route.roles.includes(recipient.role)) continue;

      try {
        await adapter.send(recipient.identifier, message);

        await this.logService.log(
          event.type,
          recipient.identifier,
          channel,
          NotificationStatus.SUCCESS,
          message,
        );
      } catch (error) {
        await this.logService.log(
          event.type,
          recipient.identifier,
          channel,
          NotificationStatus.FAILED,
          error.message,
        );
      }
    }
  }
}
