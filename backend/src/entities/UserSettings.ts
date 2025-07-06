import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "user_settings" })
export class UserSetting {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "bigint", unique: true })
  user_id!: string;

  @OneToOne(() => User, (user) => user.user_setting, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "boolean", default: true })
  sync_enabled!: boolean;

  @Column({ type: "boolean", default: false })
  encryption_enabled!: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  encryption_password_hash?: string;

  @Column({ type: "boolean", default: true })
  notification_enabled!: boolean;

  @UpdateDateColumn({ type: "datetime" })
  updated_at!: Date;
}
