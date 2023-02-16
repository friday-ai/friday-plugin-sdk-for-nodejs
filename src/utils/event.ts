/* eslint-disable @typescript-eslint/no-explicit-any */
import { DevicesActions } from '@friday-ai/shared';

export interface FplEventCallbacks {
  'device-exec': (device: string, capability: string, command: DevicesActions, params: any) => void;
  'ws-message': (...args: any) => void;
}

export declare type FplEvents = Extract<keyof FplEventCallbacks, string>;
