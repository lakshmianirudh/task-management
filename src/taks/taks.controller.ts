import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateDto } from './dto/update.dto';
import {  TasksStatus } from './taks-status.enum';
import { TaksService } from './taks.service';
import { Task } from './task.entity';
import {v4 as uuid} from 'uuid';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { GetTaskFilterDto } from './dto/filter.dto';

@Controller('taks')
@UseGuards(AuthGuard())
export class TaksController {
    constructor(private taksService : TaksService){}

    @Get()
    getAllTasks(@Query() filterDto: GetTaskFilterDto,@GetUser() user:User) : Promise<Task[]>{
        return this.taksService.getTasks(filterDto,user);
    }

    @Get('/:id')
    getTaskById(@Param('id') id:uuid,@GetUser() user:User):Promise<Task>{
        return this.taksService.getTaskById(id,user);
    }

    @Post()
    createTask(@Body() createTaskDto:CreateTaskDto,@GetUser() user:User): Promise<Task>{
        return this.taksService.createTask(createTaskDto,user);
    }
    @Delete('/:id')
    deleteTask(@Param('id') id:uuid,@GetUser() user:User) : Promise<void> {
        return this.taksService.deleteTask(id,user);
    }
    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id:uuid,@Body() updatedto:UpdateDto,@GetUser() user:User):Promise<Task>{
        const {status} = updatedto;
        return this.taksService.updateTaskStatus(id,status,user);

    }

    
   

}
