import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from 'src/dtos/create-task.dto';
import { QueueService } from 'src/services/queue.service.interface';
import { TaskRepository } from 'src/repositories/task.repository';
import { Task } from 'src/schemas/tasks.schema';

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
        return this.taskRepository.create({ title, description });
    }

    public async findAll(): Promise<Task[]> {
        return this.taskRepository.findAll();
    }
}
