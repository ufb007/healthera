# Healthera Queuing System Task

#### Technologies used
 - NestJS
 - RabbitMQ
 - AWS SQS
 - Localstack
 - MongoDB

## Installation

#### Install dependencies
```
npm install
```

#### Create Environment file

Create a `.env` file and copy the contents of `.env.example`

#### Select Queue Provider in environment SQS or RabbitMQ

```
QUEUE_PROVIDER=rabbitmq
```
or
```
QUEUE_PROVIDER=sqs
```

#### Run Containers

Runs on http://localhost:8080/

```
docker-compose up -d
```

#### Post a request to add messages to queue and process

Make a `POST` request to:

```
http://localhost:8080/tasks
```

With the payload. This will send to whichever provider has been selected and will queue and process saving to MongoDB database.

```
{
    "title": "[STRING]",
    "description": "[STRING]"
}
```

Display all data (Tasks) from Database `GET` within the browser:

```
http://localhost:8080/tasks
```

You can monitor RabbitMQ server:

```
http://localhost:15672/
```

You can monitor SQS server via the AWS CLI:

```
aws --endpoint-url=http://localhost:4566 sqs get-queue-attributes --queue-url http://localhost:4566/000000000000/taskQueue --attribute-names All
```

#### Switch Queue provider

Swith queue provider by the environment variable `QUEUE_PROVIDER` to either `rabbitmq` or `sqs` and restart docker containers:

```
docker-compose restart
```

#### Testing
No tests have been done.