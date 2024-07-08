import { HealthChecksIoApi } from '../../healthchecks-io/src/health-checks-io.api';
import { HealthCheckIOService } from '../../healthchecks-io/src/health-check-io.service';
import { HealthCheckOptions } from '../../healthchecks-io/src/common/dtos/healthchecks.dtos';
import { Logger } from './common/utils/logger';

const logger = new Logger('HealthChecks.io');
const apis: Record<string, HealthChecksIoApi> = {};
const hcService = new HealthCheckIOService();

/**
 * Load the arguments from the process arguments and parse them as
 * health check options
 */
function loadHealthCheckArgs(): HealthCheckOptions[] {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    throw new Error('No arguments provided');
  }
  return JSON.parse(decodeURIComponent(args[0])) as HealthCheckOptions[];
}

/**
 * Check if the health check options are valid.
 * @param options The health check options
 */
function checksValidation(options: HealthCheckOptions[]) {
  // check if there are multiple checks with the same name
  const checkNames = options.map((option) => option.checkName);
  const uniqueCheckNames = new Set(checkNames);
  if (uniqueCheckNames.size !== checkNames.length) {
    throw new Error('Check names must be unique');
  }
}

/**
 * Main process for the health check service that initializes the
 * health check and starts the ping service for each health check
 */
async function mainProcess() {
  // Load the health checks options and validate them
  const healthCheckOptions = loadHealthCheckArgs();
  checksValidation(healthCheckOptions);

  // Initialize the health checks
  for (const hcOptions of healthCheckOptions) {
    logger.info(`Initializing [${hcOptions.checkName}] health check`);
    apis[hcOptions.checkName] = new HealthChecksIoApi({
      apiKey: hcOptions.apiKey,
      baseUrl: hcOptions.baseUrl,
    });
    await hcService.initializeHealthCheck(apis[hcOptions.checkName], hcOptions);
  }

  // Start the ping services
  for (const hcOptions of healthCheckOptions) {
    logger.info(`Starting [${hcOptions.checkName}] ping service`);
    hcService.startPingService(
      apis[hcOptions.checkName],
      hcService.pingUrls[hcOptions.checkName],
      (hcOptions.timeout - 5) * 1000,
      hcOptions.enablePingLogs,
    );
  }
}

mainProcess();
