import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum HiringEventType {
  APPLICATION_RECEIVED = 'APPLICATION_RECEIVED',
  APPLICATION_ARCHIVED = 'APPLICATION_ARCHIVED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  OFFER_EXTENDED = 'OFFER_EXTENDED',
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  OFFER_DECLINED = 'OFFER_DECLINED',
}

export enum RecipientRole {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
  HIRING_MANAGER = 'HIRING_MANAGER',
}

export class Recipient {
  @IsEnum(RecipientRole)
  role: RecipientRole;

  @IsString()
  identifier: string; // could be email, deviceId, etc.

  @IsOptional()
  channel?: 'email' | 'push' | 'console'; // for channel-specific routing (optional override)
}

export class HiringEventDto {
  @IsEnum(HiringEventType)
  @ApiProperty({ enum: HiringEventType })
  type: HiringEventType;

  @IsObject()
  @ApiProperty({ type: Object })
  payload: Record<string, any>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Recipient)
  @ApiProperty({ type: [Recipient] })
  recipients: Recipient[];
}
