import { Injectable } from '@nestjs/common';
import { QueueService } from '../queue.service.interface';
import { 
    SQSClient, 
    SendMessageCommand, 
    ReceiveMessageCommand, 
    CreateQueueCommand, 
    DeleteMessageCommand 
} from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService implements QueueService {
    private sqsClient = new SQSClient({ 
        region: process.env.AWS_REGION,
        endpoint: process.env.SQS_LOCALSTACK_ENDPOINT,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
    public queueName: string = 'taskQueue';
    private queueUrl: string;

    /**
     * Creates an SQS queue with the specified name and assigns the resulting queue URL to the `queueUrl` property.
     *
     * @return {Promise<string>} The URL of the created queue.
     */
    private async createQueue() {
        try {
            const result = await this.sqsClient.send(new CreateQueueCommand({QueueName: this.queueName}));
            this.queueUrl = result.QueueUrl;

            return this.queueUrl;
        } catch (err) {
            console.log("Error", err);
        }
    }

    /**
     * Publishes a message to an SQS queue.
     *
     * @param {string} message - The message to be published.
     * @return {Promise<void>} A promise that resolves when the message is successfully published or an error occurs.
     */
    async publishMessage(message: string): Promise<void> {
        if (!this.queueUrl) {
            await this.createQueue();
        }

        const params = {
            QueueUrl: `${process.env.SQS_LOCALSTACK_ENDPOINT}/000000000000/${this.queueName}`,
            MessageBody: message
        }

        try {
            const data = await this.sqsClient.send(new SendMessageCommand(params));
            console.log("Message sent successfully", data.MessageId);
        } catch (err) {
            console.log("Error", err);
        }
    }

    /**
     * Consumes messages from an SQS queue and processes them using the provided message handler.
     *
     * @param {(message: string) => Promise<void>} messageHandler - The function to handle each message received from the queue.
     * @return {Promise<void>} A promise that resolves when all messages have been processed or an error occurs.
     */
    async consumeMessages(messageHandler: (message: string) => Promise<void>): Promise<void> {
        if (!this.queueUrl) {
            await this.createQueue();
        }

        while (true) {
            try {
                const receiveParams = {
                    QueueUrl: `${process.env.SQS_LOCALSTACK_ENDPOINT}/000000000000/${this.queueName}`,
                    MaxNumberOfMessages: 10,
                    WaitTimeSeconds: 20
                }

                const data = await this.sqsClient.send(new ReceiveMessageCommand(receiveParams));

                if (data.Messages && data.Messages.length > 0) {
                    for (const message of data.Messages) {
                        await messageHandler(message.Body);

                        // Delete the message after processing
                        await this.sqsClient.send(new DeleteMessageCommand({
                            QueueUrl: this.queueUrl,
                            ReceiptHandle: message.ReceiptHandle
                        }));
                    }
                }
            } catch (err) {
                console.log("Error", err);
            }
        }
    }

    /**
     * Initializes the module and starts consuming messages.
     *
     * @return {Promise<void>} A promise that resolves when message consumption starts.
     */
    public async onModuleInit(): Promise<void> {
        await this.createQueue();
        // Start consuming messages
        this.consumeMessages(async (message) => {
            console.log('Received message:', message);
            // Process the message here
        });
    }
}
