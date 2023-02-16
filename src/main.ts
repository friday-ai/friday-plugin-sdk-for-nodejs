import logger from '@friday-ai/logger';
import { MqttOptions, DeviceRegisterAttributes, TypedEventEmitter } from '@friday-ai/shared';

import Catch from './utils/error';
import { FplEventCallbacks } from './utils/event';

import Database from './database/database';
import MqttClient from './mqtt/mqtt';
import Server from './front/server';

const defaultMqttOptions: MqttOptions = {
  port: 1883,
  host: 'localhost',
  protocol: 'mqtt',
};

class FPL extends TypedEventEmitter<FplEventCallbacks> {
  private readonly pluginName: string;
  private readonly mqttClient: MqttClient;
  private readonly server: Server;
  public pluginId = '';
  public satelliteId = '';

  public database: Database;

  constructor(pluginName: string) {
    super();
    this.pluginName = pluginName;
    this.database = new Database(pluginName.toLowerCase());
    this.mqttClient = new MqttClient(this);
    this.server = new Server(this, './src/client');

    this.init();
  }

  @Catch()
  private async init(): Promise<void> {
    logger.init(this.pluginName);

    this.pluginId = await this.database.getData<string>('/config/pluginId', 'null');
    this.satelliteId = await this.database.getData<string>('/config/satelliteId', 'null');

    this.mqttClient.start(defaultMqttOptions);
    this.server.start();
  }

  @Catch()
  public registerDevice(device: DeviceRegisterAttributes): void {
    // Allawys set the pluginId
    device.pluginId = this.pluginId;
    this.mqttClient.publish(`friday/master/device/register`, JSON.stringify(device));
  }

  public sendWsMsg(message = {}) {
    this.server.ws.sendMessage(message);
  }
}

export default FPL;

export { logger, Catch };

export * from '@friday-ai/shared';
