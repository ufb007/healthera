import { Injectable } from '@nestjs/common';
import { QueueService } from '../queue.service.interface';
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, CreateQueueCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService implements QueueService {
    private sqs = new SQSClient({ 
        region: process.env.AWS_REGION,
        endpoint: process.env.SQS_LOCALSTACK_ENDPOINT,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
    public queueName: string = 'taskQueue';

    private async createQueue() {
        try {
            const QueueUrl = await this.sqs.send(new CreateQueueCommand({QueueName: this.queueName}));
            return QueueUrl;
        } catch (err) {
            console.log("Error", err);
        }
    }

    async publishMessage(message: string): Promise<void> {
        const queueUrl = await this.createQueue();

        const params = {
            QueueUrl: `${process.env.SQS_LOCALSTACK_ENDPOINT}/000000000000/${this.queueName}`,
            MessageBody: message
        }

        try {
            const data = await this.sqs.send(new SendMessageCommand(params));
            console.log("Message sent successfully", data.MessageId);
        } catch (err) {
            console.log("Error", err);
        }
    }

    public async onModuleInit() {
        console.log('THIS IS ON MODULE INIT')
    }
}
