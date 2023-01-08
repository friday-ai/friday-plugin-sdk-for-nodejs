import consoleStamp from 'console-stamp';
import logger from './utils/log';
import Catch from './utils/error';
import { MqttOptions, PluginMode } from './utils/interfaces';

import Database from './api/database/database';
import MqttClient from './api/mqtt/mqtt';
import Server from './front/server';

import {
  DeviceCapabilityRegisterType,
  DeviceCapabilitySettingsRegisterType,
  DeviceCapabilitySettingsSchema,
  DeviceRegisterType,
  DevicesActionsType,
  DevicesCapabilityType,
  DevicesType,
} from './config/device';

const defaultMqttOptions: MqttOptions = {
  port: 1883,
  host: 'localhost',
  protocol: 'mqtt',
};

export default class FPL {
  private readonly pluginName: string;
  private readonly pluginExec: any;
  private readonly pluginWsClientHandler: any;
  private readonly mqttClient: MqttClient;
  private server: Server;

  public database: Database;

  constructor(pluginName: string, pluginExec: any, pluginWsClientHandler: any) {
    this.pluginName = pluginName;
    this.pluginExec = pluginExec;
    this.pluginWsClientHandler = pluginWsClientHandler;
    this.database = new Database(pluginName.toLowerCase());
    this.mqttClient = new MqttClient(this.pluginExec);
    this.server = new Server('./src/client', this.pluginWsClientHandler);

    this.init();
  }

  @Catch()
  private async init(): Promise<void> {
    consoleStamp(console, {
      format: ':customDate().grey :customLabel.black.bgWhite',
      tokens: {
        customDate: () => {
          return new Date().toISOString().slice(11, -1);
        },
        customLabel: () => {
          return this.pluginName;
        },
      },
    });

    this.mqttClient.start(defaultMqttOptions);
    this.server.start();
  }

  @Catch()
  public registerDevice(device: DeviceRegisterType): void {
    this.mqttClient.publish(`friday/master/device/register`, JSON.stringify(device));
  }

  public sendWsMsg(message = {}) {
    this.server.ws.sendMessage(message);
  }
}

export { logger, Catch, PluginMode, DevicesType, DevicesActionsType, DevicesCapabilityType };
export type { DeviceCapabilitySettingsRegisterType, DeviceCapabilitySettingsSchema, DeviceRegisterType };
export type { DeviceCapabilityRegisterType };
