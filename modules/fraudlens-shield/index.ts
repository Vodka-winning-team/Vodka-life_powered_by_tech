// Shield native module (Android only). In Expo Go and on the web it doesn't exist, so it is null there.

import { requireOptionalNativeModule, type EventSubscription } from 'expo-modules-core';

export type ShieldMessage = { app: string; text: string };

type ShieldModule = {
  isAccessEnabled(): boolean;
  canShowAlerts(): boolean;
  openAccessSettings(): void;
  openAppSettings(): void;
  createChannel(name: string, description: string): void;
  showAlert(id: number, title: string, body: string, message: string): void;
  addListener(event: 'onMessage', listener: (message: ShieldMessage) => void): EventSubscription;
};

const Shield = requireOptionalNativeModule<ShieldModule>('FraudlensShield');

export default Shield;
