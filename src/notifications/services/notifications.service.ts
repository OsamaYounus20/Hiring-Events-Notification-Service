import { Injectable } from '@nestjs/common';
import { NotificationFactory } from '../notifications.factory';
import { HiringEventDto } from '../dtos/hiring-event.dto';

@Injectable()
export class NotificationService {
  constructor(private factory: NotificationFactory) {}

  async handleEvent(event: HiringEventDto): Promise<void> {
    const notification = this.factory.create(event);
    await notification.send();
  }
}
