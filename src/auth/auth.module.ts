import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './fortyTwo.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from './strategys/jwtAccess.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from './strategys/jwtRefresh.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, TokenSchema } from 'src/schemas/auth/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: TokenSchema },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_AT_SECRET'),
        signOptions: { expiresIn: 60 * 60 * 7 },
      }),
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FortyTwoStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    PassportModule,
  ],
  exports: [JwtAccessStrategy, PassportModule, AuthService],
})
export class AuthModule {}
