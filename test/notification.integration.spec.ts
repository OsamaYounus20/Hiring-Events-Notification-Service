import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationLogRepository } from 'src/db/repositories/notification-log.repository';
import { ConsoleAdapter } from 'src/notifications/channels/console.adapter';
import { EmailAdapter } from 'src/notifications/channels/email.adapter';
import { PushAdapter } from 'src/notifications/channels/push.adapter';
import {
  HiringEventType,
  RecipientRole,
} from 'src/notifications/dtos/hiring-event.dto';
import { ConsoleHandler } from 'src/notifications/handlers/hiring-pipeline/console.handler';
import { EmailHandler } from 'src/notifications/handlers/hiring-pipeline/email.handler';
import { PushHandler } from 'src/notifications/handlers/hiring-pipeline/push.handler';
import { NotificationDeliveryService } from 'src/notifications/services/notifications-delivery.service';
import { NotificationLogService } from 'src/notifications/services/notifications-log.service';

describe('Notification Integration Test (isolated)', () => {
  let app: INestApplication;
  let emitter: EventEmitter2;

  const emailAdapter = { send: jest.fn() };
  const consoleAdapter = { send: jest.fn() };
  const pushAdapter = { send: jest.fn() };
  const mockLogService = { log: jest.fn() };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        EmailAdapter,
        ConsoleAdapter,
        PushAdapter,
        NotificationDeliveryService,
        EmailHandler,
        ConsoleHandler,
        PushHandler,
        { provide: NotificationLogService, useValue: mockLogService },
        {
          provide: NotificationLogRepository,
          useValue: { logNotification: jest.fn() },
        },
        { provide: EmailAdapter, useValue: emailAdapter },
        { provide: ConsoleAdapter, useValue: consoleAdapter },
        { provide: PushAdapter, useValue: pushAdapter },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    emitter = app.get(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should trigger all adapters and log for eligible recipients', async () => {
    const event = {
      type: HiringEventType.OFFER_EXTENDED,
      recipients: [
        { role: RecipientRole.CANDIDATE, identifier: 'alice@example.com' },
        { role: RecipientRole.RECRUITER, identifier: 'recruiter@example.com' },
        { role: RecipientRole.HIRING_MANAGER, identifier: 'hm@example.com' },
      ],
      payload: { position: 'Software Engineer' },
    };

    emitter.emit('notification.hiring', event);
    await new Promise((res) => setTimeout(res, 100));

    expect(emailAdapter.send).toHaveBeenCalledTimes(2);
    expect(consoleAdapter.send).toHaveBeenCalledTimes(2);
    expect(pushAdapter.send).toHaveBeenCalledTimes(2);
    expect(mockLogService.log).toHaveBeenCalledTimes(6);
  });
});
