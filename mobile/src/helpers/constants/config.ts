import { Platform } from 'react-native';

// Centralized configuration for API and Socket base URLs
export const API_BASE_URL: string =
  Platform.select({ ios: 'http://localhost:5050', android: 'http://10.0.2.2:5050' }) || 'http://localhost:5050';

export const SOCKET_URL: string = API_BASE_URL;


