import { IsEnum } from "class-validator";
import { TasksStatus } from "../taks-status.enum";

export class UpdateDto{
    @IsEnum(TasksStatus)
    status : TasksStatus;
}