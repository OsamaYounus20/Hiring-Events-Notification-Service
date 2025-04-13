import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './services/notifications.service';
import { HiringEventDto } from './dtos/hiring-event.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Handles an incoming hiring event notification
   *
   * @example
   * {
   *   "type": "INTERVIEW_SCHEDULED",
   *   "recipients": [
   *     { "role": "CANDIDATE", "identifier": "c@example.com" },
   *     { "role": "HIRING_MANAGER", "identifier": "hm@example.com" }
   *   ],
   *   "payload": {
   *     "interviewTime": "2025-04-20T10:00:00Z"
   *   }
   * }
   * @param eventDto the event to be handled
   * @returns a promise that resolves when the event has been handled
   */
  @Post('event')
  @ApiBody({ type: HiringEventDto })
  async receiveEvent(@Body() eventDto: HiringEventDto) {
    return this.notificationService.handleEvent(eventDto);
  }
}
