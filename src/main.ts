import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Api documentation')
    .setDescription('All of the endpoints are described below.')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)

  await app.listen(3000)
}
bootstrap()
