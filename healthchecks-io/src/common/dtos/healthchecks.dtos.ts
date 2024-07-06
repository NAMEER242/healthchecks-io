export type CreateCheckRequest = {
  name: string;
  tags?: string;
  slug?: string;
  desc?: string;
  timeout: number;
  grace?: number;
  manual_resume?: boolean;
  methods?: string;
  channels?: string;
};

export type UpdateCheckRequest = {
  name?: string;
  tags?: string;
  slug?: string;
  desc?: string;
  timeout?: number;
  grace?: number;
  manual_resume?: boolean;
  methods?: string;
  channels?: string;
};

export type HealthCheckOptions = {
  apiKey: string;
  baseUrl: string;
  checkName: string;
  checkDescription: string;
  tags?: string;
  slug?: string;
  timeout: number;
  grace: number;
  channels: string;
  enablePingLogs: boolean;
  methods?: string;
  manual_resume?: boolean;
};
