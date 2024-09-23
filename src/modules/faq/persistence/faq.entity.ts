import { CommonEntity } from '@libs/common/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('faqs')
export class FaqEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column({ type: 'jsonb', nullable: true })
  tags: string[];
  //   @Column({ type: 'jsonb', nullable: true, name: 'cover_image' })
  //   coverImage: FileDto;
}
