import { InjectionToken } from '@angular/core';
import pkg from '../../package.json';

declare global {
  interface Window {
    __APP_VERSION__?: string;
  }
}

export const APP_VERSION = new InjectionToken<string>('APP_VERSION', {
  providedIn: 'root',
  factory: () =>
    (typeof window !== 'undefined' ? window.__APP_VERSION__ : undefined) ?? pkg.version,
});
