import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { UploadRecord } from './UploadRecord'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  openid!: string

  @Column({ nullable: true })
  nickname!: string

  @Column({ nullable: true, type: 'text' })
  avatarUrl!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @OneToMany(() => UploadRecord, (record: UploadRecord) => record.user)
  records!: UploadRecord[]
}
