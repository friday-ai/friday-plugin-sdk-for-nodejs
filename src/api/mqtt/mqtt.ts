import { Client, connect } from 'mqtt';
import { MqttOptions } from '../../utils/interfaces';
import { logger } from '../../main';

import handleMessage from './mqtt.handleMessage';

const regexp = /plugin(.*)/;

export default class MqttClient {
  public MqttClient!: Client;
  public readonly pluginExec: any;
  public handleMessage = handleMessage;

  constructor(pluginExec: any) {
    this.pluginExec = pluginExec;
  }

  public start(mqttOptions: MqttOptions): void {
    // start the Mqtt server
    this.MqttClient = connect(mqttOptions);

    this.MqttClient.on('connect', () => {
      logger.info('Connected on mqtt broker');

      this.MqttClient.subscribe('friday/satellite/8487d42b-ccf5-426a-b1d4-b6a47bd901ca/#');

      this.MqttClient.on('message', (topic, message) => {
        logger.info(`Received message on topic ${topic}`);
        logger.info(`Message: ${message.toString()}`);

        const match = topic.match(regexp)?.[0] || '';
        this.handleMessage(match, message.toString());
      });
    });

    this.MqttClient.on('error', (error) => {
      logger.error(error.message);
    });
  }

  public publish(topic: string, message: string): void {
    this.MqttClient.publish(topic, message);
  }
}
