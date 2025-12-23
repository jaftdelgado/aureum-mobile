import { DeviceEventEmitter } from 'react-native';

export const AUTH_EVENTS = {
  LOGOUT: 'auth:logout',
  SERVER_DISCONNECT: 'server-disconnect',
};

export const emitLogout = () => DeviceEventEmitter.emit(AUTH_EVENTS.LOGOUT);
export const emitServerDisconnect = () => DeviceEventEmitter.emit(AUTH_EVENTS.SERVER_DISCONNECT);