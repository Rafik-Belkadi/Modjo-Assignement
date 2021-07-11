import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Call } from '../calls/calls.entity';

/**
 * TODO implement
 * - You should add relevant fields
 * - You should make sure they are properly decorated for typeorm
 */
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Call, (call) => call.comments)
  @JoinColumn()
  call: Call;

  @Column()
  callId: Call['id'];

  @Column()
  comment: string;

  @Column()
  timestamp: string;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
