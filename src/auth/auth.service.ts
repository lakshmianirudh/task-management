import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
        private jwtService:JwtService,

    ){}

    async signUp(authCredentialsdto : AuthCredentialsDto): Promise<void>{
        const{username,password} = authCredentialsdto;
        const salt = await bcrypt.genSalt();
        const hashespassword = await bcrypt.hash(password,salt);
        const user = this.userRepository.create({
            username,
            password : hashespassword,

        });
        try{
            await this.userRepository.save(user);

        }catch(error){
            if(error.code === '23505'){
                throw new ConflictException('Username already exists');
            }
        }
        
       
        
        


    }
    async signIn(authCredentialsdto:AuthCredentialsDto):Promise<{accessToken : string}>{
    const {username,password} = authCredentialsdto;
    const user = await this.userRepository.findOne({where:{username}});
    if(user && (await bcrypt.compare(password,user.password))){
        const payload :JwtPayload = {username};
        const accessToken:string = await this.jwtService.sign(payload);
        return { accessToken};
        
    }else{
        throw new UnauthorizedException('Please check your login credentials');

    } 
    }


}
