import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGurad } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RoleGuard } from './guards/role.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGurad, JwtStrategy, RoleGuard, Reflector],
})
export class AuthModule {}
