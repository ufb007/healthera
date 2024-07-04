import { OnModuleInit } from "@nestjs/common";

export interface QueueService extends OnModuleInit {
    queueName: string;
    publishMessage(message: string): Promise<void>;
    onModuleInit(): Promise<void>;
}
