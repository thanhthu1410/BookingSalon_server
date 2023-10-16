import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService:JwtService, private configService:ConfigService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException()
        }

        try{
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('SECRET')
            })
            console.log("🚀 ~ file: auth.guard.ts:22 ~ AuthGuard ~ canActivate ~ payload:", payload)
            if(payload.role=="ADMIN"){
                request['user_data'] = payload; 
            }else{
                throw new HttpException(' User is not an ADMIN', HttpStatus.BAD_REQUEST);
            }
      
        }catch(err){
            console.log("🚀 ~ file: auth.guard.ts:30 ~ AuthGuard ~ canActivate ~ err:", err)
            throw new HttpException({
                status: 419,
                message: "Token expired"
            }, 419)
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];

        return type === 'Bearer' ? token : undefined;
    }
}