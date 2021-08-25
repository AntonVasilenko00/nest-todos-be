import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../model/user.entity'
import { RolesService } from '../../roles/service/roles.service'
import { AddRoleDto } from '../dto/add-role.dto'
import { BanUserDto } from '../dto/ban-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private rolesService: RolesService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.repo.create(createUserDto)
    const role = await this.rolesService.getRoleByName('USER')
    user.roles = [role]
    return this.repo.save(user)
  }

  async findAll() {
    return this.repo.find({})
  }

  async findOne(id: number) {
    return this.repo.findOne(id)
  }

  async findOneByEmail(email: string) {
    return this.repo.findOne({ where: { email } })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.repo.update(id, updateUserDto)
    return this.repo.findOne(id)
  }

  async remove(id: number) {
    return (
      await this.repo
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .returning('*')
        .execute()
    ).raw[0]
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.repo.findOne(dto.userID)
    const role = await this.rolesService.getRoleByName(dto.name)

    if (role && user) {
      if (!user.userRoles.includes(role.name)) {
        user.userRoles = [...user.userRoles, role.name]
        return this.repo.save(user)
      } else
        throw new HttpException(
          'User already has such role',
          HttpStatus.BAD_REQUEST,
        )
    }

    throw new HttpException('User or Role is not found', HttpStatus.NOT_FOUND)
  }
  async banUser(dto: BanUserDto) {
    const user = await this.repo.findOne(dto.id)

    user.banned = true
    user.banReason = dto.reason

    return await this.repo.save(user)
  }
}
