import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../comments/comments.entity';
/**
 * This class represents a simplified version of a Call.
 * Which is the central entity around which Modjo's logic is organized.
 */
@Entity()
export class Call {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Column()
  duration: number;

  @OneToMany(() => Comment, (comment) => comment.call)
  comments?: Comment[];

  /**
   * crmActivityId is the id of the activity that represents the call in the CRM.
   * Example: `crmActivity = 12345` means that this call is registered into Pipedrive as the Activity with id 12345
   */
  @Column({ nullable: true })
  crmActivityId?: string;
}
