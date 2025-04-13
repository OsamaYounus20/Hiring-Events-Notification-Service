import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HiringEventDto } from '../dtos/hiring-event.dto';

@Controller()
export class EventConsumer {
  constructor(private eventEmitter: EventEmitter2) {}

  @EventPattern('hiring-pipeline-events')
  async handleKafkaEvent(@Payload() raw: any) {
    const eventDto = plainToInstance(HiringEventDto, raw);
    await validateOrReject(eventDto);
    this.eventEmitter.emit('notification.hiring', eventDto);
  }
}
