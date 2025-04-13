import { Injectable } from '@nestjs/common';
import { EmailAdapter } from './channels/email.adapter';
import { ConsoleAdapter } from './channels/console.adapter';
import { PushAdapter } from './channels/push.adapter';
import { HiringEventDto, HiringEventType } from './dtos/hiring-event.dto';

export const routingMap: Record<
  HiringEventType,
  {
    roles: string[];
    channels: ('email' | 'console' | 'push')[];
  }
> = {
  APPLICATION_RECEIVED: {
    roles: ['RECRUITER'],
    channels: ['console', 'email'],
  },
  INTERVIEW_SCHEDULED: {
    roles: ['CANDIDATE', 'HIRING_MANAGER'],
    channels: ['email', 'push'],
  },
  OFFER_EXTENDED: {
    roles: ['CANDIDATE', 'RECRUITER'],
    channels: ['email', 'console', 'push'],
  },
  APPLICATION_REJECTED: {
    roles: ['CANDIDATE'],
    channels: ['email'],
  },
  APPLICATION_ARCHIVED: {
    roles: ['RECRUITER'],
    channels: ['console'],
  },
  OFFER_ACCEPTED: {
    roles: ['HIRING_MANAGER', 'RECRUITER'],
    channels: ['email'],
  },
  OFFER_DECLINED: {
    roles: ['HIRING_MANAGER', 'RECRUITER'],
    channels: ['email'],
  },
};

@Injectable()
export class NotificationFactory {
  constructor(
    private readonly email: EmailAdapter,
    private readonly console: ConsoleAdapter,
    private readonly push: PushAdapter,
  ) {}

  create(event: HiringEventDto) {
    const route = routingMap[event.type];
    const message = `[${event.type}] - ${JSON.stringify(event.payload)}`;

    const send = async () => {
      if (!route) {
        console.warn(`No routing rule defined for event: ${event.type}`);
        return;
      }

      const { roles, channels } = route;

      for (const recipient of event.recipients || []) {
        if (!roles.includes(recipient.role)) {
          console.log(
            `Skipping recipient ${recipient.identifier} (role ${recipient.role}) for event ${event.type}`,
          );
          continue;
        }

        if (channels.includes('email')) {
          await this.email.send(recipient.identifier, message);
        }

        if (channels.includes('console')) {
          await this.console.send(recipient.identifier, message);
        }

        if (channels.includes('push')) {
          await this.push.send(recipient.identifier, message);
        }
      }
    };

    return { send };
  }
}
