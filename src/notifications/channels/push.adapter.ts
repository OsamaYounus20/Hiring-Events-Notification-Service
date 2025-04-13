import { Injectable } from '@nestjs/common';
import { NotificationChannel } from '../interfaces/notification-channel.interface.';

@Injectable()
export class PushAdapter implements NotificationChannel {
  async send(recipient: string, message: string): Promise<void> {
    console.log(`Push notification to ${recipient}: ${message}`);
    // Later: Integrate with FCM, OneSignal, etc.
  }
}
