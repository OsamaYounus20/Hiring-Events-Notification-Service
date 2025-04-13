import { Injectable } from '@nestjs/common';
import { NotificationChannel } from '../interfaces/notification-channel.interface.';

@Injectable()
export class ConsoleAdapter implements NotificationChannel {
  async send(recipient: string, message: string): Promise<void> {
    console.log(`Console notification for ${recipient}: ${message}`);
  }
}
