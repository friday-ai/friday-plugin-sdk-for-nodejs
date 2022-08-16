export enum PluginMode {
  NOMINAL,
  WAITING_CONFIGURATION,
}

export interface MqttOptions {
  port: number;
  host?: string;
  hostname?: string;
  path?: string;
  protocol?: 'wss' | 'ws' | 'mqtt' | 'mqtts' | 'tcp' | 'ssl' | 'wx' | 'wxs';
  keepalive?: number;
  username?: string;
  password?: string;
  qos?: 0 | 1 | 2;
}
