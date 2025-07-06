import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne
} from 'typeorm'
import { User } from './User'

@Entity()
export class UploadRecord {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, user => user.records)
  user!: User

  @Column({ type: 'text' })
  imageUrl!: string

  @Column({ default: 'unknown' })
  type!: string

  @Column({ type: 'text', nullable: true })
  resultText!: string

  @CreateDateColumn()
  uploadTime!: Date

  @UpdateDateColumn()
  lastModified!: Date
}
