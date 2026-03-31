import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module.js';
import { CommonModule } from './common/common.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
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
        JWT_SECRET: Joi.string().required(),
        WEBHOOK_SECRET: Joi.string().required(),
        FRONTEND_URL: Joi.string().default('http://localhost:5173'),
        PORT: Joi.number().default(3000),
      }),
    }),
    PrismaModule,
    CommonModule,
    AuthModule,
    UsersModule,
    ContactsModule,
    SessionsModule,
    ChatModule,
    WhatsAppModule,
  ],
})
export class AppModule {}
