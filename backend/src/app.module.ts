import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { ChatModule } from './chat/chat.module.js';
import { WhatsAppModule } from './whatsapp/whatsapp.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        DIRECT_URL: Joi.string().required(),
        META_ACCESS_TOKEN: Joi.string().required(),
        META_PHONE_NUMBER_ID: Joi.string().required(),
        META_WABA_ID: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    PrismaModule,
    ContactsModule,
    SessionsModule,
    ChatModule,
    WhatsAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
