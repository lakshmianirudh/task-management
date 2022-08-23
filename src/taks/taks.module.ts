import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TaksController } from './taks.controller';
import { TaskRepository } from './taks.repository';
import { TaksService } from './taks.service';
import { Task } from './task.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Task]),AuthModule],
  controllers: [TaksController],
  providers: [TaksService]
})
export class TaksModule {}
