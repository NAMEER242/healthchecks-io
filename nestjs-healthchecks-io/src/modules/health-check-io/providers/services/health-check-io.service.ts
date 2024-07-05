import { Logger } from '../../../../common/utils/logger';
import { HealthChecksIoApi } from '../../../../healthchecks_io/api';
import { HealthCheckOptions } from '../../../../common/dtos/healthchecks.dtos';

export class HealthCheckIOService {
  logger = new Logger('HealthChecks.io');
  pingUrls: Record<string, string> = {};

  /**
   * Initialize the health check by creating a new check if it
   * does not exist or updating the existing check
   */
  async initializeHealthCheck(
    api: HealthChecksIoApi,
    options: HealthCheckOptions,
  ) {
    // Check if the health check exists
    const data = await api.listChecks();
    const checks: Array<any> = data['checks'];
    const projectCheck = checks.filter((check) => {
      return check['name'] === options.checkName;
    })?.[0];
    const hasProjectCheck = !!projectCheck;

    // Create the health check if it does not exist else
    // update the existing check
    if (!hasProjectCheck) {
      const result = await api.createCheck({
        name: options.checkName,
        tags: options.tags,
        slug: options.slug,
        desc: options.checkDescription,
        grace: options.grace,
        timeout: options.timeout,
        channels: options.channels,
        methods: options.methods,
        manual_resume: options.manual_resume,
      });
      this.pingUrls[options.checkName] = result['ping_url'];
      this.logger.success('Check created');
    } else {
      const result = await api.updateCheck(projectCheck['update_url'], {
        name: options.checkName,
        tags: options.tags,
        slug: options.slug,
        desc: options.checkDescription,
        grace: options.grace,
        timeout: options.timeout,
        channels: options.channels,
        methods: options.methods,
        manual_resume: options.manual_resume,
      });
      this.pingUrls[options.checkName] = result['ping_url'];
      this.logger.info('Check already exists');
      this.logger.info('check info updated!');
    }
  }

  /**
   * Ping the health check
   * @returns true if the ping was successful, false otherwise
   */
  async ping(api: HealthChecksIoApi, pingUrl: string, enablePingLogs: boolean) {
    try {
      await api.pingCheck(pingUrl);
      enablePingLogs && this.logger.success(`Ping successful on [${pingUrl}]`);
      return true;
    } catch (error) {
      enablePingLogs && this.logger.error(`Ping failed: \n${error}`);
      return false;
    }
  }

  /**
   * Start the ping service
   * @param interval The interval in milliseconds to ping the health check
   * @param enablePingLogs Enable or disable ping logs
   * @param api The health check API
   * @param pingUrl The ping URL
   */
  startPingService(
    api: HealthChecksIoApi,
    pingUrl: string,
    interval: number,
    enablePingLogs: boolean,
  ) {
    // first ping, then set interval
    this.ping(api, pingUrl, enablePingLogs).then(() => {
      setInterval(async () => {
        await this.ping(api, pingUrl, enablePingLogs);
      }, interval);
    });
  }
}
