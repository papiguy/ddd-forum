import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { Post } from '../entities/Post';
import { UniqueEntityID } from '../../../../domain/UniqueEntityID';
import { DomainEvents } from '../../../../domain/events/DomainEvents';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  listenTo() {
    return Post;
  }

  private dispatchEvents(post: Post) {
    const aggregateId = new UniqueEntityID(post.post_id);
    DomainEvents.dispatchEventsForAggregate(aggregateId);
  }

  afterInsert(event: InsertEvent<Post>) {
    if (event.entity) {
      this.dispatchEvents(event.entity);
    }
  }

  afterUpdate(event: UpdateEvent<Post>) {
    if (event.entity) {
      this.dispatchEvents(event.entity as Post);
    }
  }

  afterRemove(event: RemoveEvent<Post>) {
    if (event.entity) {
      this.dispatchEvents(event.entity as Post);
    }
  }
}
