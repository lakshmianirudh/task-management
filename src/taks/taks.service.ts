import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksStatus } from './taks-status.enum';
import {v4 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { timeStamp } from 'console';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './taks.repository';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { query } from 'express';
import { GetTaskFilterDto } from './dto/filter.dto';

@Injectable()
export class TaksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository:Repository<Task>,
    ){}

    // private tasks : Task[] = [];

    async getTasks(filterDto: GetTaskFilterDto,user:User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.tasksRepository.createQueryBuilder('task');
        query.where({user});
        if (status) {
          query.andWhere('task.status = :status', { status });
        }
        if (search) {
          query.andWhere(
            '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
            { search: `%${search}%` },
          );
        }
        const tasks = await query.getMany();
        return tasks;
      }

    async createTask(createTaskDto:CreateTaskDto,user:User):Promise<Task>{
        const {title,description} = createTaskDto;
        const task = this.tasksRepository.create({
            title,
            description,
            status:TasksStatus.OPEN,
            user,


        });
       
        await this.tasksRepository.save(task);
        return(task);
    }

       async getTaskById(id:uuid,user:User) : Promise<Task> {
        const found = await this.tasksRepository.findOne({where:{id,user}});
        if(!found){
            throw new NotFoundException(`Task with ID "${id}" not found`)

        }
        return found;


       }
    
    async deleteTask(id:uuid,user:User):Promise<void>{
        const result = await this.tasksRepository.delete({id,user});
        console.log(result);
        if(result.affected === 0){
            throw new NotFoundException(`Task with ID "${id}" not found`)
        }

     }
    async updateTaskStatus(id:uuid,status:TasksStatus,user:User) : Promise<Task>{
        const task = await this.getTaskById(id,user);
        task.status=status;
        await this.tasksRepository.save(task);

        return task;
    }
}
