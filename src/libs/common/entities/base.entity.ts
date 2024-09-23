import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ObjectLiteral,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
export abstract class BaseEntity implements ObjectLiteral {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true, name: 'created_by' })
  createdBy?: string;
  @Column({ nullable: true, name: 'updated_by' })
  updatedBy?: string;
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
  })
  updatedAt: Date;
  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;
  @Column({ nullable: true, name: 'deleted_by' })
  deletedBy: string;
  @Column({ nullable: true, type: 'text', name: 'archive_reason' })
  archiveReason: string;
}
