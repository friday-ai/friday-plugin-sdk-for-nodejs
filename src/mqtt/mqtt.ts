import logger from '@friday-ai/logger';
import { MqttOptions } from '@friday-ai/shared';
import { Client, connect } from 'mqtt';

import FPL from '../main';

import handleMessage from './mqtt.handleMessage';

const regexp = /plugin(.*)/;

export default class MqttClient {
  public fpl: FPL;

  public MqttClient!: Client;

  public handleMessage = handleMessage;

  constructor(fpl: FPL) {
    this.fpl = fpl;
  }

  public start(mqttOptions: MqttOptions): void {
    // start the Mqtt client
    this.MqttClient = connect(mqttOptions);

    this.MqttClient.on('connect', () => {
      logger.info("Connected on Friday's broker");

      this.MqttClient.subscribe(`friday/satellite/${this.fpl.pluginId}/#`);

      this.MqttClient.on('message', (topic, message) => {
        // TODO: Debug mode
        // logger.info(`Received message on topic ${topic}`);
        // logger.info(`Message: ${message.toString()}`);

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
