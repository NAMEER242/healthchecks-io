# NestJS HealthChecks.io Client

This repository contains the npm package `nestjs-healthchecks-io`, which serves as a client for the [HealthChecks.io](https://healthchecks.io) service. HealthChecks.io is a monitoring service that checks your applications' health and sends notifications through various channels (like email or Telegram) if your application goes down.

This package spawns a child process that periodically sends requests to the HealthChecks.io service, indicating that the main process is running. If the main process stops, the child process also stops, and HealthChecks.io will stop receiving requests. After a certain period, it will notify any attached notification channels about the failure status of the project.

## Installation

You can install this package from npm using the following command:

```bash
npm install nestjs-healthchecks-io
```

## Usage
To configure this package use the following options:

```typescript
{
apiKey: string; // The API key for the HealthChecks.io service if it is self-hosted otherwise it is "https://healthchecks.io/api/v3"
baseUrl: string; // The URL of the HealthChecks.io service
checkName: string; // The name for the check
checkDescription: string; // The description of the check
tags?: string; // Optional: tags for the check
slug?: string; // Optional: slug for the check
timeout: number; // The period in which you will send requests
grace: number; // The period after which the check will send a failure notification if it doesn't receive any pinging requests
channels: string; // Notification channels names or IDs
enablePingLogs: boolean; // If true, the package will print logs for pinging requests
methods?: string; // Optional: allowed REST methods to receive pinging requests
manual_resume?: boolean; // Optional: if true, the check will automatically resume if it stopped for a long time and then received a ping request
}
```

To use this package, you can use the `HealthCheckIoModule` to configure the package. Here is an example:

```typescript
import { HealthCheckIoModule } from 'nestjs-healthchecks-io';

HealthCheckIoModule.forRoot([
{
baseUrl: 'https://healthchecks.io/api/v3',
apiKey: 'your-api-key',
checkName: 'your-check-name',
checkDescription: 'your-check-description',
timeout: 900,
grace: 1800,
channels: 'channel1,channel2',
enablePingLogs: true,
manual_resume: false,
slug: 'your-slug',
tags: 'your-tags',
methods: 'GET,POST',
},
]);
```