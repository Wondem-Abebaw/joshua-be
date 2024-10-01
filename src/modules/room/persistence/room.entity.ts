import { Address } from '@libs/common/address';
import { CommonEntity } from '@libs/common/common.entity';
import { ContactPerson } from '@libs/common/emergency-contact';
import { RoomStatus } from '@libs/common/enums';
import { FileDto } from '@libs/common/file-dto';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rooms')
export class RoomEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ nullable: true })
  description: string;
  @Column()
  price: number;
  @Column({ type: 'jsonb', nullable: true })
  amenities: string[];
  @Column({ nullable: true, type: 'jsonb' })
  roomImage: FileDto;
  @Column({ default: true })
  enabled: boolean;
  @Column({ nullable: true })
  status: string;
}
