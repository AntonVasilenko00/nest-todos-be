import * as dotenv from 'dotenv'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

dotenv.config()

export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  synchronize: true,
  autoLoadEntities: true,
} as TypeOrmModuleOptions
