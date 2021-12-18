import { Injectable } from '@nestjs/common';
import { EventGateway } from './event.gateway';

@Injectable()
export class EventService {
  constructor(private readonly eventGateway: EventGateway) {}

  emit(event: string, message: any) {
    this.eventGateway.server.emit(event, message);
  }
}
