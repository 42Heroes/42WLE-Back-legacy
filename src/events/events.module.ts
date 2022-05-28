import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { UserModule } from 'src/user/user.module';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [UserModule, AuthModule, JwtModule, ChatModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
