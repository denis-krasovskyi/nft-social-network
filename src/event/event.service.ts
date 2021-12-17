import { Injectable } from '@nestjs/common';
import { EventGateway } from './event.gateway';

@Injectable()
export class EventService {
  constructor(private readonly eventGateway: EventGateway) {}

  broadcast(message: Record<string, unknown>) {
    this.eventGateway.server.emit('broadcast', message);
  }
}
