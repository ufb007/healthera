import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task, TaskDocument } from "src/schemas/tasks.schema";
import { CreateTaskDto } from "src/dtos/create-task.dto";

@Injectable()
export class TaskRepository {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

    async create({ title, description }: CreateTaskDto) {
        try {
            const createdTask = new this.taskModel({ title, description });
            return createdTask.save();
        } catch (err) {
            throw new HttpException(
                'Error creating task',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAll(): Promise<Task[]> {
        try {
            return this.taskModel.find().exec();
        } catch (err) {
            throw new HttpException(
                'Error finding tasks',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findById(id: string): Promise<Task> {
        try {
            return this.taskModel.findById(id).exec();
        } catch (err) {
            throw new HttpException(
                'Error finding task',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}