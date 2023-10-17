import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ){}
  async login(loginUserDto:LoginUserDto):Promise<any>{
    const user=await this.userRepository.findOne(
      {
        where:{ userName:loginUserDto.userName}
      }
    )
  
    if(!user){
      throw new HttpException("User Name is not exist", HttpStatus.UNAUTHORIZED)
    };
    if(user.password!=loginUserDto.password) {
      throw new HttpException("Password is not correct", HttpStatus.UNAUTHORIZED)
    }
    const payload={id:user.id, userName:user.userName, role:user.role }
    return this.generateToken(payload);
  }
   private async generateToken(payload: {id: number, userName: string}) {

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('SECRET'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
    })
    await this.userRepository.update(
      {userName:payload.userName},
      {refreshToken,}
    )
    return {accessToken, refreshToken}
   }
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}