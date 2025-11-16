/**
 * Environment configuration for API testing
 */
export interface EnvironmentConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

/**
 * Get environment configuration based on NODE_ENV
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = process.env.NODE_ENV || 'production';
  
  const configs: Record<string, EnvironmentConfig> = {
    production: {
      baseURL: process.env.API_BASE_URL || 'https://petstore.swagger.io/v2',
      timeout: 30000,
      retries: 2,
    },
    staging: {
      baseURL: process.env.API_BASE_URL || 'https://staging.petstore.swagger.io/v2',
      timeout: 30000,
      retries: 2,
    },
    development: {
      baseURL: process.env.API_BASE_URL || 'http://localhost:8080/v2',
      timeout: 15000,
      retries: 0,
    },
  };

  return configs[env] || configs.production;
};

export const config = getEnvironmentConfig();
