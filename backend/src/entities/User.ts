import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { UploadRecord } from './UploadRecord'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number


  @Column({
    name: "password_hash",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  passwordHash?: string;

  // @Column({ unique: true })
  // openid?: string

  @Column({ type: 'text' })
  username?: string

  // @Column({ type: 'text' })
  // avatarUrl?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @Column({ nullable: true })
  phone?: string

  @OneToMany(() => UploadRecord, (record: UploadRecord) => record.user)
  records!: UploadRecord[]
}
