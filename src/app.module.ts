import { Module } from '@nestjs/common';
import { TaksModule } from './taks/taks.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [TaksModule,
  TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'postgres',
    database:'task-management',
    autoLoadEntities:true,
    synchronize:true,
  }),
  AuthModule],
  controllers: [],
  
})
export class AppModule {}
