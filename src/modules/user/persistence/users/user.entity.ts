import { FileDto } from '@libs/common/file-dto';
import { Address } from '@libs/common/address';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { EmergencyContact } from '@libs/common/emergency-contact';
import { BaseEntity } from '@libs/common/entities/base.entity';
@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Index()
  @Column({ nullable: true })
  email: string;
  @Index()
  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ name: 'emergency_contact', type: 'jsonb', nullable: true })
  emergencyContact: EmergencyContact;
  @Column({ name: 'enabled', default: true })
  enabled: boolean;
  @Column({ name: 'profile_image', type: 'jsonb', nullable: true })
  profileImage: FileDto;
  @Column({ type: 'jsonb', nullable: true })
  address: Address;
}
