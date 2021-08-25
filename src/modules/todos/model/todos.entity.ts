import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../../users/model/user.entity'

@Entity()
export class Todo {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Column()
  text: string

  @ApiProperty({ default: false })
  @Column({ default: false })
  isCompleted: boolean

  @Column({ name: 'userID' })
  userID: number

  @ManyToOne(() => User, (user) => user.todos, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userID' })
  user: User
}
