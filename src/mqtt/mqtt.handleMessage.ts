import logger from '@friday-ai/logger';
import MqttClientClass from './mqtt';

export default function handleMessage(this: MqttClientClass, topic: string, message: string): void {
  const args = JSON.parse(message.toString());
  switch (topic) {
    case 'plugin/exec':
      this.fpl.emit('device-exec', args.device, args.capability, args.method, args.params);
      break;
    default:
      logger.error(`Unknown topic ${topic}`);
      break;
  }
}
