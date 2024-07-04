import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateTaskDto } from 'src/dtos/create-task.dto';
import { QueueService } from 'src/services/queue.service.interface';
import { TasksService } from 'src/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(
        @Inject('QUEUE_SERVICE') 
        private readonly queueService: QueueService,
        private readonly tasksService: TasksService
    ) {}

    @Post()
    public async createTask(@Body() createTaskDto: CreateTaskDto): Promise<void> {
        await this.queueService.publishMessage(JSON.stringify(createTaskDto));
        //await this.tasksService.create(createTaskDto);
    }
}
