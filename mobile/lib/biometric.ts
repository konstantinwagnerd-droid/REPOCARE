/**
 * Biometrisches Entsperren per Face ID / Touch ID / Fingerprint.
 */
import * as LocalAuthentication from 'expo-local-authentication';
import { kv } from './storage';

const BIO_ENABLED_KEY = 'biometric.enabled';

export async function isBiometricAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
}

export async function getSupportedTypes(): Promise<string[]> {
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  return types.map((t) => {
    switch (t) {
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return 'Face ID';
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return 'Fingerabdruck';
      case LocalAuthentication.AuthenticationType.IRIS:
        return 'Iris';
      default:
        return 'Biometrie';
    }
  });
}

export async function authenticate(reason = 'CareAI entsperren'): Promise<boolean> {
  const res = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    cancelLabel: 'Abbrechen',
    fallbackLabel: 'Passwort verwenden',
    disableDeviceFallback: false,
  });
  return res.success;
}

export function setBiometricEnabled(enabled: boolean) {
  kv.setBool(BIO_ENABLED_KEY, enabled);
}

export function isBiometricEnabled(): boolean {
  return kv.getBool(BIO_ENABLED_KEY) ?? false;
}
