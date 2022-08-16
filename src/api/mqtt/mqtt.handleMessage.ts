import MqttClientClass from './mqtt';
import logger from '../../utils/log';

export default function handleMessage(this: MqttClientClass, topic: string, message: string): void {
  const args = JSON.parse(message.toString());
  switch (topic) {
    case 'plugin/exec':
      this.pluginExec(args.device, args.method, args.params);
      break;
    default:
      logger.error(`Unknown topic ${topic}`);
      break;
  }
}
