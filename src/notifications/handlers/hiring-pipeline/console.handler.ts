import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HiringEventDto } from '../../dtos/hiring-event.dto';
import { ConsoleAdapter } from '../../channels/console.adapter';
import { NotificationDeliveryService } from '../../services/notifications-delivery.service';

@Injectable()
export class ConsoleHandler {
  constructor(
    private readonly consoleAdapter: ConsoleAdapter,
    private readonly deliveryService: NotificationDeliveryService,
  ) {}

  @OnEvent('notification.hiring', { async: true })
  async onNotification(event: HiringEventDto): Promise<void> {
    await this.deliveryService.deliverViaChannel(
      'console',
      this.consoleAdapter,
      event,
    );
  }
}
