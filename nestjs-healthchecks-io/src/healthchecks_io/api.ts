import axios, { AxiosInstance } from 'axios';
import {
  CreateCheckRequest,
  UpdateCheckRequest,
} from '../common/dtos/healthchecks.dtos';
import { Logger } from '../common/utils/logger';

const logger = new Logger('HealthChecks.io');

interface HealthCheckOptions {
  apiKey: string;
  baseUrl: string;
}

export class HealthChecksIoApi {
  private api: AxiosInstance;

  constructor(private readonly options: HealthCheckOptions) {
    this.api = axios.create({
      baseURL: this.options.baseUrl,
      headers: {
        'X-Api-Key': this.options.apiKey,
      },
    });
  }

  // List all checks
  async listChecks() {
    try {
      const response = await this.api.get('checks/');
      return response.data;
    } catch (error) {
      logger.error(`Error listing checks: \n ${error}`);
      throw error;
    }
  }

  // Get a single check by its unique key
  async singleCheck(checkId: string) {
    try {
      const response = await this.api.get(`checks/${checkId}/`);
      return response.data;
    } catch (error) {
      logger.error(`Error retrieving check: \n ${error}`);
      throw error;
    }
  }

  // Create a new check
  async createCheck(data: CreateCheckRequest) {
    try {
      const response = await this.api.post('checks/', JSON.stringify(data));
      return response.data;
    } catch (error) {
      logger.error(`Error creating check: \n ${error}`);
      throw error;
    }
  }

  // Update an existing check by its unique key
  async updateCheck(updateUrl: string, data: UpdateCheckRequest) {
    try {
      const response = await this.api.post(updateUrl, JSON.stringify(data));
      return response.data;
    } catch (error) {
      logger.error(`Error updating check: \n ${error}`);
      throw error;
    }
  }

  // Delete a check by its unique key
  async deleteCheck(checkId: string) {
    try {
      const response = await this.api.delete(`checks/${checkId}/`);
      return response.data;
    } catch (error) {
      logger.error(`Error deleting check: \n ${error}`);
      throw error;
    }
  }

  // Pause or resume checks
  async pauseResumeCheck(checkId: string, action: 'pause' | 'resume') {
    try {
      const response = await this.api.post(`checks/${checkId}/${action}/`);
      return response.data;
    } catch (error) {
      logger.error(`Error ${action}ing check: \n ${error}`);
      throw error;
    }
  }

  /**
   * data works just for the log type to send the log message.
   */
  async pingCheck(
    pingUrl: string,
    type?: null | '/start' | '/fail' | '/log' | '',
    data?: string,
  ) {
    type = type ?? '';
    try {
      const response = await this.api.post(`${pingUrl}${type}`, data ?? '');
      return response.data;
    } catch (error) {
      logger.error(`Error pinging check: \n ${error}`);
      throw error;
    }
  }
}
