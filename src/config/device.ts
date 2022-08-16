export enum DevicesType {
  PHYSICAL = 'physical',
  VIRTUAL = 'virtual',
  SERVICE = 'service',
}

export enum DevicesCapabilityType {
  ONOFF = 'onoff',
  BRIGHTNESS = 'brightness',
}

export enum DevicesActionsType {
  TURN_ON = 'action.devices.commands.turn_on',
  TURN_OFF = 'action.devices.commands.turn_off',
  SET_BRIGHTNESS = 'action.devices.commands.set_brightness',
}

type OnOffSettings = null;

interface BrightnessSettings extends Record<string, any> {
  min: number;
  max: number;
  step: number;
}

export type DeviceCapabilitySettingsSchema = OnOffSettings | BrightnessSettings;

export interface DeviceCapabilitySettingsRegisterType {
  type: DevicesCapabilityType;
  value: DeviceCapabilitySettingsSchema;
}

export interface DeviceCapabilityRegisterType {
  defaultName: string;
  type: DevicesCapabilityType;
  settings?: DeviceCapabilitySettingsSchema;
}

export interface DeviceRegisterType {
  defaultName: string;
  defaultManufacturer: string;
  defaultModel: string;
  type: DevicesType;
  deviceId?: string;
  pluginId: string;
  pluginSelector?: string;
  capabilities?: DeviceCapabilityRegisterType[];
}
