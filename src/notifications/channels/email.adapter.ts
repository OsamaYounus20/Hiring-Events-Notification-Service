import { Injectable } from '@nestjs/common';
import { NotificationChannel } from '../interfaces/notification-channel.interface.';

@Injectable()
export class EmailAdapter implements NotificationChannel {
  async send(recipient: string, message: string): Promise<void> {
    console.log(`Email to ${recipient}: ${message}`);
    //replace with implementation of sendgrid/ses/nodemailer etc
  }
}
