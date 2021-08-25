import { SetMetadata } from '@nestjs/common'

export const ROLES_META_KEY = 'roles'

export const Roles = (...roles: string[]) => SetMetadata(ROLES_META_KEY, roles)
