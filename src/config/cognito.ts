export const COGNITO_CONFIG = {
  REGION: process.env.EXPO_PUBLIC_AWS_REGION,
  USER_POOL_ID: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID,
  CLIENT_ID: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID,
  REDIRECT_URI: process.env.EXPO_PUBLIC_COGNITO_REDIRECT_URI
};

/**
 * Constructs the Cognito authorization endpoint URL
 */
export function getAuthorizationUrl(): string {
  const { REGION, USER_POOL_ID } = COGNITO_CONFIG;
  return `https://${USER_POOL_ID}.auth.${REGION}.amazoncognito.com/oauth2/authorize`;
}

/**
 * Constructs the Cognito token endpoint URL
 */
export function getTokenUrl(): string {
  const { REGION, USER_POOL_ID } = COGNITO_CONFIG;
  return `https://${USER_POOL_ID}.auth.${REGION}.amazoncognito.com/oauth2/token`;
}