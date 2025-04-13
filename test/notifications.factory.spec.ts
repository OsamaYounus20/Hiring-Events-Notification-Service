import { ConsoleAdapter } from 'src/notifications/channels/console.adapter';
import { EmailAdapter } from 'src/notifications/channels/email.adapter';
import { PushAdapter } from 'src/notifications/channels/push.adapter';
import {
  HiringEventType,
  RecipientRole,
} from 'src/notifications/dtos/hiring-event.dto';
import { NotificationFactory } from 'src/notifications/notifications.factory';

describe('NotificationFactory (multi-recipient with routing map + push)', () => {
  const emailMock = { send: jest.fn() };
  const consoleMock = { send: jest.fn() };
  const pushMock = { send: jest.fn() };

  const factory = new NotificationFactory(
    emailMock as unknown as EmailAdapter,
    consoleMock as unknown as ConsoleAdapter,
    pushMock as unknown as PushAdapter,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send all channel notifications for eligible recipients (OFFER_EXTENDED)', async () => {
    const event = {
      type: HiringEventType.OFFER_EXTENDED,
      recipients: [
        { role: RecipientRole.CANDIDATE, identifier: 'alice@example.com' },
        { role: RecipientRole.RECRUITER, identifier: 'recruiter@example.com' },
      ],
      payload: { position: 'Engineer' },
    };

    const notification = factory.create(event);
    await notification.send();

    // 2 recipients × 3 channels = 6 calls
    expect(emailMock.send).toHaveBeenCalledTimes(2);
    expect(consoleMock.send).toHaveBeenCalledTimes(2);
    expect(pushMock.send).toHaveBeenCalledTimes(2);

    expect(pushMock.send).toHaveBeenCalledWith(
      'alice@example.com',
      expect.any(String),
    );
    expect(pushMock.send).toHaveBeenCalledWith(
      'recruiter@example.com',
      expect.any(String),
    );
  });
});
