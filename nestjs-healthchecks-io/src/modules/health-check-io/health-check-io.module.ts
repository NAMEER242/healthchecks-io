import { DynamicModule, Inject, Logger, Module } from '@nestjs/common';
import { OnApplicationBootstrap } from '@nestjs/common/interfaces/hooks/on-application-bootstrap.interface';
import { spawn } from 'child_process';
import { HealthCheckOptions } from '../../../../healthchecks-io/src/common/dtos/healthchecks.dtos';
import { join } from 'path';

const logger = new Logger('HealthChecks.io');

@Module({})
export class HealthCheckIoModule implements OnApplicationBootstrap {
  constructor(
    @Inject('HEALTH_CHECKS')
    private readonly healthChecks: HealthCheckOptions[],
  ) {}

  static forRoot(healthChecks: HealthCheckOptions[]): DynamicModule {
    return {
      module: HealthCheckIoModule,
      providers: [
        {
          provide: 'HEALTH_CHECKS',
          useValue: healthChecks,
        },
      ],
    };
  }

  async onApplicationBootstrap() {
    // Start the health check process
    const healthCheckProcess = spawn(
      'npx',
      [
        'ts-node',
        join(__dirname, './providers/processes/health-check-io.process.js'),
        encodeURIComponent(JSON.stringify(this.healthChecks)),
      ],
      {
        shell: true,
        env: process.env,
      },
    );

    // Log the health check process output and errors
    healthCheckProcess.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
    healthCheckProcess.stderr.on('data', (data) => {
      logger.error(`Health Check Error: ${data}`);
    });
    healthCheckProcess.on('close', (code) => {
      logger.log(`Health check process exited with code ${code}`);
    });

    // Ensure the health check process is killed when the application stops
    const cleanup = () => {
      healthCheckProcess.kill();
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', cleanup);
  }
}
