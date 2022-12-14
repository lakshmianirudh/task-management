
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TasksStatus } from '../taks-status.enum';
export class GetTaskFilterDto {
  @IsOptional()
  @IsEnum(TasksStatus)
  status?: TasksStatus;
  @IsOptional()
  @IsString()
  search?: string;
}