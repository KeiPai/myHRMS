/**
 * Hrm Application
 * Main application class extending BaseApplication
 */

import {
  BaseApplication,
  IApplicationInfo,
  AuthenticationStrategyRegistry,
  HealthCheckComponent,
  Environment,
  IApplicationConfigs,
} from '@venizia/ignis';
import { cors } from 'hono/cors';
import appInfo from '../package.json';
import { AuthController } from './controllers';
import { DbDataSource } from './datasources';
import { env, getCorsOrigins, getJwtConfig, getKeycloakConfig, getShellGrpcUrl } from './config';
import { BindingKeys } from './constants';
import {
  CacheService,
  ICacheServiceOptions,
  TokenBlacklistService,
  JwtTokenService,
  IJwtTokenServiceOptions,
  KeycloakTokenService,
  IKeycloakTokenServiceOptions,
  ShellAuthGatewayClientService,
  ShellAuthGatewayClientOptions,
  AuthService,
} from './services';
import { JwtAuthenticationStrategy, KeycloakAuthenticationStrategy } from './strategies';
import { createGrpcHandler } from './grpc';

const SERVER_BASE_PATH = env.APP_ENV_SERVER_BASE_PATH ?? '/api';

export const appConfigs: IApplicationConfigs = {
  host: env.APP_ENV_HOST,
  port: +(env.APP_ENV_PORT ?? 3000),
  path: {
    base: env.APP_ENV_SERVER_BASE_PATH,
    isStrict: true,
  },
  error: { rootKey: 'error' },
  debug: {
    shouldShowRoutes: env.APP_ENV_NODE_ENV !== Environment.PRODUCTION,
  },
  bootOptions: {}
};

export class HrmApplication extends BaseApplication {
  override getAppInfo(): IApplicationInfo {
    return appInfo;
  }

  override async start() {
    await super.start();
  }

  staticConfigure() {
  }

  setupMiddlewares() {
    try {
      const server = this.getServer();
      if (server) {
        const corsOrigins = getCorsOrigins();
        server.use(
          '*',
          cors({
            origin: corsOrigins,
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
            allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            credentials: true,
            maxAge: 86400,
          }),
        );
      }
    } catch (error: any) {
    }
  }

  preConfigure() {
    this.bindDataSources();
    this.bindComponents();
    this.bindServices();
    this.bindControllers();
    this.bindRepositories();
  }

  bindDataSources() {
    // Bind DbDataSource
    this.dataSource(DbDataSource);
  }

  bindRepositories() {
    // Bind repositories
  }

  bindComponents() {
    // Bind TokenBlacklistService
    this.component(HealthCheckComponent);
  }

  bindServices() {
    const jwtConfig = getJwtConfig();
    const jwtTokenOptions: IJwtTokenServiceOptions = {
      secret: jwtConfig.secret,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    };
    this.bind<IJwtTokenServiceOptions>({ key: BindingKeys.JWT_TOKEN_SERVICE_OPTIONS })
      .toValue(jwtTokenOptions);
    this.service(JwtTokenService);

    // Bind CacheService
    const cacheOptions: ICacheServiceOptions = {
      defaultTtl: 30, // 30 seconds default TTL
    };
    this.bind<ICacheServiceOptions>({ key: BindingKeys.CACHE_SERVICE_OPTIONS })
      .toValue(cacheOptions);
    this.service(CacheService);

    const keycloakConfig = getKeycloakConfig();
    const keycloakTokenOptions: IKeycloakTokenServiceOptions = {
      keycloakUrl: keycloakConfig.url,
      realm: keycloakConfig.realm,
      clientId: keycloakConfig.clientId,
    };
    this.bind<IKeycloakTokenServiceOptions>({ key: BindingKeys.KEYCLOAK_TOKEN_SERVICE_OPTIONS })
      .toValue(keycloakTokenOptions);
    this.service(KeycloakTokenService);

    this.bind<ShellAuthGatewayClientOptions>({ key: 'shellAuthGatewayClientOptions' })
      .toValue({ shellGrpcBaseUrl: getShellGrpcUrl() });
    this.service(ShellAuthGatewayClientService);

    this.service(AuthService)
    this.service(TokenBlacklistService)
  }

  bindControllers() {
    // Bind AuthController
    this.controller(AuthController);
  }

  registerStrategies() {
    // Register Keycloak authentication strategy
    AuthenticationStrategyRegistry.getInstance().register({
      container: this,
      strategies: [
        {
          name: BindingKeys.STRATEGY_KEYCLOAK,
          strategy: KeycloakAuthenticationStrategy,
        },
        {
          name: BindingKeys.STRATEGY_JWT,
          strategy: JwtAuthenticationStrategy,
        },
      ],
    });
  }

  postConfigure() {
  }

  override async initialize(): Promise<void> {
    await super.initialize();
    const app = (this as any).getRootRouter?.();
    if (app) {
      const authService = this.get<AuthService>({ key: 'services.AuthService' });
      if (authService) {
        app.use('/auth.v1.AuthService/*', createGrpcHandler(authService, { basePath: SERVER_BASE_PATH }));
      }
    }
  }

  configure() {
    // Additional configuration if needed
  }
}

