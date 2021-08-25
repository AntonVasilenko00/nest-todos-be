import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Role } from '../model/roles.entity'
import { Repository } from 'typeorm'
import { CreateRoleDto } from '../dto/createRole.dto'

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  async createRole(dto: CreateRoleDto): Promise<Role> {
    return this.repo.save(dto)
  }

  async getRoleByName(name: string): Promise<Role> {
    return this.repo.findOne({ where: { name } })
  }

  async getAllRoles(): Promise<Role[]> {
    return this.repo.find({})
  }
}
