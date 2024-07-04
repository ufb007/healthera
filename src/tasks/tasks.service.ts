import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from 'src/dtos/create-task.dto';
import { QueueService } from 'src/services/queue.service.interface';
import { TaskRepository } from 'src/repositories/task.repository';

type TasksType = {
    title: string;
    description: string;
};

@Injectable()
export class TasksService {
    constructor(
        @Inject('QUEUE_SERVICE') private queueService: QueueService,
        private taskRepository: TaskRepository
    ) {}

    public async create({ title, description }: TasksType) {
        console.log('THIS IS FROM TASKS SERVICE - ', title);
        //await this.queueService.publishMessage(JSON.stringify({ title, description }));
        return this.taskRepository.create({ title, description });
    }
}
