import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { BaseUser } from '../entities/BaseUser';
import { UniqueEntityID } from '../../../../domain/UniqueEntityID';
import { DomainEvents } from '../../../../domain/events/DomainEvents';

@EventSubscriber()
export class BaseUserSubscriber implements EntitySubscriberInterface<BaseUser> {
  listenTo() {
    return BaseUser;
  }

  private dispatchEvents(baseUser: BaseUser) {
    const aggregateId = new UniqueEntityID(baseUser.base_user_id);
    DomainEvents.dispatchEventsForAggregate(aggregateId);
  }

  afterInsert(event: InsertEvent<BaseUser>) {
    if (event.entity) {
      this.dispatchEvents(event.entity);
    }
  }

  afterUpdate(event: UpdateEvent<BaseUser>) {
    if (event.entity) {
      this.dispatchEvents(event.entity as BaseUser);
    }
  }

  afterRemove(event: RemoveEvent<BaseUser>) {
    if (event.entity) {
      this.dispatchEvents(event.entity as BaseUser);
    }
  }
}
