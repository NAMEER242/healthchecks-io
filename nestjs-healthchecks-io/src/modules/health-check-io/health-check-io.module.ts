import { DynamicModule, Inject, Module } from '@nestjs/common';
import { OnApplicationBootstrap } from '@nestjs/common/interfaces/hooks/on-application-bootstrap.interface';
import { HealthCheckOptions } from '../../common/dtos/healthchecks.dtos';
import { spawn } from 'child_process';
import { Logger } from '../../common/utils/logger';

const logger = new Logger('HealthChecks.io');

@Module({})
export class TypeormVersionControlModule implements OnApplicationBootstrap {
  constructor(
    @Inject('HEALTH_CHECKS')
    private readonly healthChecks: HealthCheckOptions[],
  ) {} // private readonly tableVersionService: TableVersionService,

  static forRoot(healthChecks: HealthCheckOptions[]): DynamicModule {
    return {
      module: TypeormVersionControlModule,
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
        'src/process.ts',
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
      logger.info(`Health check process exited with code ${code}`);
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
