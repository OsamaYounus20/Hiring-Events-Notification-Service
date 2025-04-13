import { EmailAdapter } from 'src/notifications/channels/email.adapter';
import {
  HiringEventDto,
  HiringEventType,
  RecipientRole,
} from 'src/notifications/dtos/hiring-event.dto';
import { EmailHandler } from 'src/notifications/handlers/hiring-pipeline/email.handler';
import { NotificationDeliveryService } from 'src/notifications/services/notifications-delivery.service';

describe('EmailHandler', () => {
  const emailMock = { send: jest.fn() };
  const deliveryMock = { deliverViaChannel: jest.fn() };

  const handler = new EmailHandler(
    emailMock as unknown as EmailAdapter,
    deliveryMock as unknown as NotificationDeliveryService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate to deliveryService.deliverViaChannel()', async () => {
    const event: HiringEventDto = {
      type: HiringEventType.INTERVIEW_SCHEDULED,
      recipients: [
        { role: RecipientRole.CANDIDATE, identifier: 'alice@example.com' },
        { role: RecipientRole.HIRING_MANAGER, identifier: 'hm@example.com' },
        {
          role: RecipientRole.RECRUITER,
          identifier: 'not-eligible@example.com',
        },
      ],
      payload: {
        interviewTime: '2025-04-20T10:00:00Z',
      },
    };

    await handler.onNotification(event);

    expect(deliveryMock.deliverViaChannel).toHaveBeenCalledWith(
      'email',
      emailMock,
      event,
    );
    expect(deliveryMock.deliverViaChannel).toHaveBeenCalledTimes(1);
  });
});
