import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationLog } from 'src/db/entities/notification-log.entity';
import { NotificationLogRepository } from 'src/db/repositories/notification-log.repository';
import { DataSource } from 'typeorm';
import { ConsoleAdapter } from './channels/console.adapter';
import { EmailAdapter } from './channels/email.adapter';
import { EventConsumer } from './consumers/hiring-events-consumer';
import { ConsoleHandler } from './handlers/hiring-pipeline/console.handler';
import { EmailHandler } from './handlers/hiring-pipeline/email.handler';
import { NotificationController } from './notifications.controller';
import { NotificationFactory } from './notifications.factory';
import { NotificationService } from './services/notifications.service';
import { PushAdapter } from './channels/push.adapter';
import { PushHandler } from './handlers/hiring-pipeline/push.handler';
import { NotificationDeliveryService } from './services/notifications-delivery.service';
import { NotificationLogService } from './services/notifications-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationLog])],
  controllers: [NotificationController, EventConsumer],
  providers: [
    {
      provide: NotificationLogRepository,
      useFactory: (dataSource: DataSource) =>
        new NotificationLogRepository(dataSource),
      inject: [DataSource],
    },
    NotificationService,
    NotificationFactory,
    EmailAdapter,
    EmailHandler,
    ConsoleAdapter,
    ConsoleHandler,
    PushAdapter,
    PushHandler,
    NotificationDeliveryService,
    NotificationLogService,
  ],
})
export class NotificationModule {}
