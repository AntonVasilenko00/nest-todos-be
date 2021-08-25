import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { RolesService } from '../service/roles.service'
import { CreateRoleDto } from '../dto/createRole.dto'

@Controller('roles')
export class RolesController {
  constructor(private service: RolesService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.service.createRole(dto)
  }

  @Get('/:name')
  getByName(@Param('name') name: string) {
    return this.service.getRoleByName(name)
  }

  @Get()
  getAllRoles() {
    return this.service.getAllRoles()
  }
}
