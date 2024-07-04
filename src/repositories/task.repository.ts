import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task, TaskDocument } from "src/schemas/tasks.schema";
import { CreateTaskDto } from "src/dtos/create-task.dto";

@Injectable()
export class TaskRepository {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

    async create({ title, description }: CreateTaskDto) {
        const createdTask = new this.taskModel({ title, description });
        return createdTask.save();
    }

    async findAll(): Promise<Task[]> {
        return this.taskModel.find().exec();
    }

    async findById(id: string): Promise<Task> {
        return this.taskModel.findById(id).exec();
    }
}