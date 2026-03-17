export const BindingKeys = {
  // Options
  JWT_TOKEN_SERVICE_OPTIONS: 'jwtTokenServiceOptions',
  KEYCLOAK_OAUTH_SERVICE_OPTIONS: 'keycloakOAuthServiceOptions',
  KEYCLOAK_TOKEN_SERVICE_OPTIONS: 'keycloakTokenServiceOptions',
  CACHE_SERVICE_OPTIONS: 'cacheServiceOptions',

  // Strategies
  STRATEGY_JWT: 'jwt',
  STRATEGY_KEYCLOAK: 'keycloak',
} as const;