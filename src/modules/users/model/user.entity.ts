import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Todo } from '../../todos/model/todos.entity'
import { Role } from '../../roles/model/roles.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ nullable: true, default: false })
  banned: boolean

  @Column({ nullable: true, default: '' })
  banReason: string

  @Column('varchar', { array: true, default: ['USER'] })
  userRoles: string[]

  @OneToMany(() => Todo, (todo) => todo.user, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  todos: Todo[]

  @ManyToMany(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roles' })
  roles: Role[]
}
