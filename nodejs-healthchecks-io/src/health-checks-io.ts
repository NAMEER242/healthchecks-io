import { spawn } from 'child_process';
import { Logger } from './common/utils/logger';
import { HealthCheckOptions } from '../../healthchecks-io/src/common/dtos/healthchecks.dtos';
import { join } from 'path';

const logger = new Logger('HealthChecks.io');

async function healthchecks(healthChecks: HealthCheckOptions[]) {
  // Start the health check process
  const healthCheckProcess = spawn(
    'npx',
    [
      'ts-node',
      join(__dirname, './health-check-io.process.js'),
      encodeURIComponent(JSON.stringify(healthChecks)),
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
