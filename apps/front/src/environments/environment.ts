export interface Environment {
  production: boolean;
  appName: string;
  apiUrl: string;
}

export const environment: Environment = {
  production: import.meta.env.NG_APP_ENV === 'production',
  appName: 'SGA Univalle',
  apiUrl: import.meta.env.NG_APP_API_URL || 'http://localhost:3000/api',
};
