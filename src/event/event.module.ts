import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { EventService } from './event.service';

@Module({
  providers: [EventGateway, EventService],
  exports: [EventGateway, EventService],
})
export class EventModule {}
