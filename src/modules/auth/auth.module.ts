import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

@Module({
  imports:[TypeOrmModule.forFeature([User]),
  JwtModule.register({
    global:true,
    secret:'123456',
    signOptions:{expiresIn:"30s"} 
  }),
  ConfigModule
],
  controllers: [AuthController], 
  providers: [AuthService],
})
export class AuthModule {}
