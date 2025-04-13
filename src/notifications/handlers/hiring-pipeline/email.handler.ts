import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HiringEventDto } from '../../dtos/hiring-event.dto';
import { EmailAdapter } from '../../channels/email.adapter';
import { NotificationDeliveryService } from '../../services/notifications-delivery.service';

@Injectable()
export class EmailHandler {
  constructor(
    private readonly emailAdapter: EmailAdapter,
    private readonly deliveryService: NotificationDeliveryService,
  ) {}

  @OnEvent('notification.hiring', { async: true })
  async onNotification(event: HiringEventDto): Promise<void> {
    await this.deliveryService.deliverViaChannel(
      'email',
      this.emailAdapter,
      event,
    );
  }
}
