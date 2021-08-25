import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../../users/model/user.entity'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column()
  description: string

  @ManyToMany(() => User, (user) => user.roles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: User[]
}
