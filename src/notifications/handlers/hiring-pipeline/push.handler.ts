import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HiringEventDto } from '../../dtos/hiring-event.dto';
import { PushAdapter } from '../../channels/push.adapter';
import { NotificationDeliveryService } from 'src/notifications/services/notifications-delivery.service';

@Injectable()
export class PushHandler {
  constructor(
    private readonly pushAdapter: PushAdapter,
    private readonly deliveryService: NotificationDeliveryService,
  ) {}

  @OnEvent('notification.hiring', { async: true })
  async onNotification(event: HiringEventDto): Promise<void> {
    await this.deliveryService.deliverViaChannel(
      'push',
      this.pushAdapter,
      event,
    );
  }
}
