import { NotificationStatus } from 'src/db/enums/notification-status.enums';
import { NotificationLogService } from 'src/notifications/services/notifications-log.service';

describe('NotificationLogService', () => {
  const mockRepo = {
    logNotification: jest.fn(),
  };

  const service = new NotificationLogService(mockRepo as any);

  it('should call repository logNotification with correct params', async () => {
    await service.log(
      'OFFER_EXTENDED',
      'user@example.com',
      'email',
      NotificationStatus.SUCCESS,
      'message',
    );

    expect(mockRepo.logNotification).toHaveBeenCalledWith(
      'OFFER_EXTENDED',
      'user@example.com',
      'email',
      NotificationStatus.SUCCESS,
      'message',
    );
  });
});
