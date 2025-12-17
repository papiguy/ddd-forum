import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { Member } from '../entities/Member';
import { UniqueEntityID } from '../../../../domain/UniqueEntityID';
import { DomainEvents } from '../../../../domain/events/DomainEvents';

@EventSubscriber()
export class MemberSubscriber implements EntitySubscriberInterface<Member> {
  listenTo() {
    return Member;
  }

  private dispatchEvents(member: Member) {
    const aggregateId = new UniqueEntityID(member.member_id);
    DomainEvents.dispatchEventsForAggregate(aggregateId);
  }

  afterInsert(event: InsertEvent<Member>) {
    if (event.entity) {
      this.dispatchEvents(event.entity);
    }
  }

  afterUpdate(event: UpdateEvent<Member>) {
    if (event.entity) {
      this.dispatchEvents(event.entity as Member);
    }
  }

  afterRemove(event: RemoveEvent<Member>) {
    if (event.entity) {
      this.dispatchEvents(event.entity as Member);
    }
  }
}
